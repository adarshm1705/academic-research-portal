import { getDatabase } from '../../../lib/db';

export default function handler(req, res) {
  const db = getDatabase();

  if (req.method === 'GET') {
    const reviews = db.peer_reviews.map(pr => {
      const paper = db.papers.find(p => p.paper_id === pr.paper_id);
      const reviewer = db.reviewers.find(r => r.reviewer_id === pr.reviewer_id);
      const user = reviewer ? db.users.find(u => u.user_id === reviewer.user_id) : null;
      const comments = db.review_comments.filter(rc => rc.review_id === pr.review_id);

      return {
        ...pr,
        paper_title: paper?.title,
        venue: paper?.venue,
        reviewer_name: user?.name,
        reviewer_email: user?.email,
        comments
      };
    });

    return res.status(200).json({ reviews });
  }

  if (req.method === 'POST') {
    const { paper_id, reviewer_id, rating, recommendation, status, comment_data } = req.body;
    if (!paper_id || !rating) {
      return res.status(400).json({ error: 'paper_id and rating (1-10) are required.' });
    }

    const review_id = (db.peer_reviews.length ? Math.max(...db.peer_reviews.map(r => r.review_id)) : 0) + 1;
    const newReview = {
      review_id,
      paper_id: Number(paper_id),
      reviewer_id: Number(reviewer_id) || 1,
      rating: Number(rating),
      recommendation: recommendation || '',
      status: status || (Number(rating) >= 7 ? 'accepted' : 'pending'),
      review_date: new Date().toISOString()
    };

    db.peer_reviews.unshift(newReview);

    // If comment_data is provided, insert into review_comments (JSONB document)
    if (comment_data) {
      const comment_id = (db.review_comments.length ? Math.max(...db.review_comments.map(c => c.comment_id)) : 0) + 1;
      db.review_comments.push({
        comment_id,
        review_id,
        comment_data: typeof comment_data === 'string' ? JSON.parse(comment_data) : comment_data,
        created_at: new Date().toISOString()
      });
    }

    // Activity feed log
    const actId = (db.activity_feeds.length ? Math.max(...db.activity_feeds.map(a => a.activity_id)) : 0) + 1;
    db.activity_feeds.unshift({
      activity_id: actId,
      user_id: 3, // Reviewer user
      activity_type: 'peer_review_completed',
      ref_id: newReview.paper_id,
      details: { action: 'submit_review', rating: newReview.rating, status: newReview.status },
      created_at: new Date().toISOString()
    });

    return res.status(201).json({ review: newReview, message: 'Review successfully recorded.' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

