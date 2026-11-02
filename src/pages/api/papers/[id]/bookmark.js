import { getDatabase } from '../../../../lib/db';

export default function handler(req, res) {
  const { id } = req.query;
  const paperId = Number(id);
  const db = getDatabase();
  const userId = 2; // Active logged in user: Adarsh

  if (req.method === 'POST') {
    const existingIndex = db.bookmarks.findIndex(b => b.paper_id === paperId && b.user_id === userId);
    if (existingIndex >= 0) {
      // Toggle off (DELETE)
      db.bookmarks.splice(existingIndex, 1);
      return res.status(200).json({ bookmarked: false, message: 'Bookmark removed.' });
    } else {
      // Toggle on (INSERT)
      const bookmark_id = (db.bookmarks.length ? Math.max(...db.bookmarks.map(b => b.bookmark_id)) : 0) + 1;
      db.bookmarks.push({
        bookmark_id,
        user_id: userId,
        paper_id: paperId,
        created_at: new Date().toISOString()
      });

      // Audit activity feed
      const actId = (db.activity_feeds.length ? Math.max(...db.activity_feeds.map(a => a.activity_id)) : 0) + 1;
      db.activity_feeds.unshift({
        activity_id: actId,
        user_id: userId,
        activity_type: 'bookmark_created',
        ref_id: paperId,
        details: { action: 'add_bookmark', paper_id: paperId },
        created_at: new Date().toISOString()
      });

      return res.status(200).json({ bookmarked: true, message: 'Bookmark added.' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

