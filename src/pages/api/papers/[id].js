import { getDatabase, findSimilarPapers } from '../../../lib/db';

export default function handler(req, res) {
  const { id } = req.query;
  const paperId = Number(id);
  const db = getDatabase();

  const paper = db.papers.find(p => p.paper_id === paperId);
  if (!paper) {
    return res.status(404).json({ error: 'Paper not found.' });
  }

  const track = db.conference_tracks.find(ct => ct.track_id === paper.track_id);

  // Authors with institutions
  const authors = db.paper_authors
    .filter(pa => pa.paper_id === paperId)
    .sort((a, b) => a.author_order - b.author_order)
    .map(pa => {
      const author = db.authors.find(a => a.author_id === pa.author_id);
      const inst = author ? db.institutions.find(i => i.institution_id === author.institution_id) : null;
      return {
        ...author,
        institution_name: inst?.name,
        country: inst?.country,
        author_order: pa.author_order
      };
    });

  // Citations: Papers cited by this paper
  const citedPapers = db.citations
    .filter(c => c.citing_paper_id === paperId)
    .map(c => {
      const p = db.papers.find(item => item.paper_id === c.cited_paper_id);
      return { citation_id: c.citation_id, ...p };
    });

  // Citations: Papers that cite this paper
  const citingPapers = db.citations
    .filter(c => c.cited_paper_id === paperId)
    .map(c => {
      const p = db.papers.find(item => item.paper_id === c.citing_paper_id);
      return { citation_id: c.citation_id, ...p };
    });

  // Peer reviews with JSON comments
  const reviews = db.peer_reviews
    .filter(pr => pr.paper_id === paperId)
    .map(pr => {
      const reviewer = db.reviewers.find(r => r.reviewer_id === pr.reviewer_id);
      const user = reviewer ? db.users.find(u => u.user_id === reviewer.user_id) : null;
      const comments = db.review_comments.filter(rc => rc.review_id === pr.review_id);
      return {
        ...pr,
        reviewer_name: user?.name || 'Anonymous Reviewer',
        expertise: reviewer?.expertise,
        comments
      };
    });

  // Vector Similar Papers (pgvector cosine search)
  const similarPapers = findSimilarPapers(paperId, 4);

  // Check user bookmark status (default active user: 2 - Adarsh)
  const isBookmarked = db.bookmarks.some(b => b.paper_id === paperId && b.user_id === 2);

  return res.status(200).json({
    paper: {
      ...paper,
      track_name: track?.track_name,
      conference_name: track?.conference_name,
      track_description: track?.description,
      authors,
      cited_papers: citedPapers,
      citing_papers: citingPapers,
      reviews,
      similar_papers: similarPapers,
      is_bookmarked: isBookmarked
    }
  });
}

