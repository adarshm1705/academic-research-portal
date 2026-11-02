import { getDatabase, calculateHIndex } from '../../../lib/db';

export default function handler(req, res) {
  const db = getDatabase();

  if (req.method === 'GET') {
    const authorsWithHIndex = db.authors.map(author => {
      const institution = db.institutions.find(i => i.institution_id === author.institution_id);
      const papers = db.paper_authors
        .filter(pa => pa.author_id === author.author_id)
        .map(pa => db.papers.find(p => p.paper_id === pa.paper_id))
        .filter(Boolean);

      const totalCitations = papers.reduce((sum, p) => sum + p.citation_count, 0);
      const hIndex = calculateHIndex(author.author_id);

      return {
        ...author,
        institution_name: institution?.name,
        institution_country: institution?.country,
        paper_count: papers.length,
        total_citations: totalCitations,
        h_index: hIndex,
        papers: papers.map(p => ({
          paper_id: p.paper_id,
          title: p.title,
          venue: p.venue,
          citation_count: p.citation_count,
          publication_date: p.publication_date
        }))
      };
    });

    authorsWithHIndex.sort((a, b) => b.h_index - a.h_index || b.total_citations - a.total_citations);

    return res.status(200).json({ authors: authorsWithHIndex });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

