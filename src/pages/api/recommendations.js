import { generateRecommendations } from '../../lib/db';

export default function handler(req, res) {
  if (req.method === 'GET') {
    const userId = Number(req.query.user_id) || 2;
    const limit = Number(req.query.limit) || 5;

    const recommendations = generateRecommendations(userId, limit);
    return res.status(200).json({
      user_id: userId,
      algorithm: 'generate_recommendations(user_id, limit) [score = 0.6 * citations + 0.4 * bookmarks]',
      recommendations
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

