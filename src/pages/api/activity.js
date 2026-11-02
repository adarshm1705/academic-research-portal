import { getDatabase } from '../../lib/db';

export default function handler(req, res) {
  const db = getDatabase();

  if (req.method === 'GET') {
    const feeds = db.activity_feeds.map(af => {
      const user = db.users.find(u => u.user_id === af.user_id);
      return {
        ...af,
        user_name: user?.name,
        user_role: user?.role
      };
    });

    return res.status(200).json({ activities: feeds });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

