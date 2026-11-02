import { runLabQuery } from '../../../lib/db';

export default function handler(req, res) {
  if (req.method === 'POST') {
    const { queryKey } = req.body;
    if (!queryKey) {
      return res.status(400).json({ error: 'queryKey is required (e.g., "7.1", "7.4", "8.2", "9")' });
    }

    try {
      const result = runLabQuery(queryKey);
      return res.status(200).json(result);
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

