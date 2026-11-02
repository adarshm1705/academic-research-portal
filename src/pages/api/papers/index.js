import { getDatabase, semanticSearch } from '../../../lib/db';

export default function handler(req, res) {
  const db = getDatabase();

  if (req.method === 'GET') {
    const { q, track_id, mode, sort } = req.query;
    let results = [...db.papers];

    // Filter by track
    if (track_id && track_id !== 'all') {
      results = results.filter(p => p.track_id === Number(track_id));
    }

    // Search query
    if (q && q.trim()) {
      if (mode === 'vector') {
        // Vector semantic search using embedding cosine similarity
        results = semanticSearch(q, 10);
      } else {
        // Full-text search matching title, abstract, keywords
        const terms = q.toLowerCase().split(/\s+/);
        results = results.filter(p => {
          const haystack = `${p.title} ${p.abstract} ${p.keywords} ${p.venue}`.toLowerCase();
          return terms.every(t => haystack.includes(t));
        });
      }
    }

    // Enrich with author and track details
    const enriched = results.map(p => {
      const track = db.conference_tracks.find(ct => ct.track_id === p.track_id);
      const authors = db.paper_authors
        .filter(pa => pa.paper_id === p.paper_id)
        .sort((a, b) => a.author_order - b.author_order)
        .map(pa => db.authors.find(a => a.author_id === pa.author_id))
        .filter(Boolean);

      const bookmarkCount = db.bookmarks.filter(b => b.paper_id === p.paper_id).length;
      const reviews = db.peer_reviews.filter(pr => pr.paper_id === p.paper_id);
      const avgRating = reviews.length > 0 
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) 
        : null;

      return {
        ...p,
        track_name: track?.track_name,
        conference_name: track?.conference_name,
        authors,
        bookmark_count: bookmarkCount,
        review_count: reviews.length,
        avg_rating: avgRating
      };
    });

    if (mode === 'vector' && q && q.trim()) {
      enriched.sort((a, b) => (Number(b.cosine_similarity) || 0) - (Number(a.cosine_similarity) || 0));
    } else if (sort === 'citations') {
      enriched.sort((a, b) => b.citation_count - a.citation_count);
    } else if (sort === 'rating') {
      enriched.sort((a, b) => (Number(b.avg_rating) || 0) - (Number(a.avg_rating) || 0));
    }

    return res.status(200).json({ papers: enriched });
  }

  if (req.method === 'POST') {
    const { title, abstract, keywords, venue, doi, track_id, author_ids, submitted_by } = req.body;
    if (!title || !abstract) {
      return res.status(400).json({ error: 'Title and abstract are required.' });
    }

    const paper_id = (db.papers.length ? Math.max(...db.papers.map(p => p.paper_id)) : 0) + 1;
    const newPaper = {
      paper_id,
      title,
      abstract,
      keywords: keywords || '',
      publication_date: new Date().toISOString().split('T')[0],
      venue: venue || 'PES University Technical Report',
      doi: doi || `10.1145/pes.${Date.now()}`,
      submitted_by: Number(submitted_by) || 2,
      track_id: Number(track_id) || 1,
      citation_count: 0,
      fulltext_tsv: `${title} ${abstract} ${keywords}`.toLowerCase(),
      created_at: new Date().toISOString()
    };

    db.papers.unshift(newPaper);

    // Insert authors
    if (Array.isArray(author_ids)) {
      author_ids.forEach((aid, idx) => {
        db.paper_authors.push({
          paper_id,
          author_id: Number(aid),
          author_order: idx + 1
        });
      });
    }

    // Activity feed log
    const actId = (db.activity_feeds.length ? Math.max(...db.activity_feeds.map(a => a.activity_id)) : 0) + 1;
    db.activity_feeds.unshift({
      activity_id: actId,
      user_id: newPaper.submitted_by,
      activity_type: 'paper_submission',
      ref_id: paper_id,
      details: { action: 'submit_paper', title, track_id: newPaper.track_id },
      created_at: new Date().toISOString()
    });

    return res.status(201).json({ paper: newPaper });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

