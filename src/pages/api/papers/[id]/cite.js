import { addCitation, removeCitation } from '../../../../lib/db';

export default function handler(req, res) {
  const { id } = req.query;
  const citedPaperId = Number(id);

  if (req.method === 'POST') {
    const { citing_paper_id } = req.body;
    try {
      const citation = addCitation(Number(citing_paper_id), citedPaperId);
      return res.status(201).json({
        success: true,
        citation,
        message: 'Citation registered. Trigger trg_increment_citation_count executed successfully.'
      });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  if (req.method === 'DELETE') {
    const { citation_id } = req.body;
    try {
      const citation = removeCitation(Number(citation_id));
      return res.status(200).json({
        success: true,
        citation,
        message: 'Citation removed. Trigger trg_decrement_citation_count executed successfully.'
      });
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

