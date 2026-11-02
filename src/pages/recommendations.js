import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, TrendingUp, Bookmark, ArrowRight, Code } from 'lucide-react';

export default function RecommendationsPage() {
  const [userId, setUserId] = useState('2'); // Default: Adarsh Madli
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecs = async (uid = userId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/recommendations?user_id=${uid}&limit=5`);
      const data = await res.json();
      if (data.recommendations) setRecommendations(data.recommendations);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecs(userId);
  }, [userId]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span>AI Personalized Recommendation Engine</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Recommends papers not yet bookmarked by the user using stored function <code className="font-mono text-blue-700">generate_recommendations(user_id, limit)</code>
          </p>
        </div>

        {/* User Switcher */}
        <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-lg border border-slate-200 text-xs">
          <span className="font-semibold text-slate-600">Simulate User:</span>
          <select
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="px-2.5 py-1.5 rounded border border-slate-300 bg-white font-medium text-slate-800 focus:ring-1 focus:ring-blue-600"
          >
            <option value="2">User 2: Adarsh S. Madli (Researcher)</option>
            <option value="1">User 1: Dr. Shilpa S (Conference Chair)</option>
            <option value="3">User 3: Prof. Sandesh B J (Reviewer)</option>
            <option value="5">User 5: Dr. Yann LeCun (Researcher)</option>
          </select>
        </div>
      </div>

      {/* SQL Logic Code Box */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs shadow-sm overflow-x-auto">
        <div className="flex items-center space-x-2 text-amber-400 font-bold mb-2">
          <Code className="w-4 h-4" />
          <span>PostgreSQL Function Logic (Stored Procedure)</span>
        </div>
        <pre className="text-slate-300 text-[11px] leading-relaxed">{`CREATE OR REPLACE FUNCTION generate_recommendations(p_user_id BIGINT, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (paper_id BIGINT, title VARCHAR, score NUMERIC) AS $$
BEGIN
    RETURN QUERY
    SELECT p.paper_id, p.title,
           ROUND((p.citation_count * 0.6 + COUNT(DISTINCT b.bookmark_id) * 0.4)::NUMERIC, 2) AS score
    FROM papers p
    LEFT JOIN bookmarks b ON p.paper_id = b.paper_id
    WHERE p.paper_id NOT IN (
        SELECT paper_id FROM bookmarks WHERE user_id = p_user_id
    )
    GROUP BY p.paper_id, p.title, p.citation_count
    ORDER BY score DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;`}</pre>
      </div>

      {/* Recommendations Cards */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Computing personalized recommendations...</div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">All available papers have already been bookmarked by this user!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div
              key={rec.paper_id}
              className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center">
                    #{index + 1}
                  </span>
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Recommendation Score: {rec.score}
                  </span>
                </div>

                <Link href={`/papers/${rec.paper_id}`}>
                  <h2 className="text-base font-bold text-slate-900 hover:text-blue-700 transition-colors mt-1">
                    {rec.title}
                  </h2>
                </Link>

                <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>{rec.citation_count} Citations (weight: 0.6)</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                    <span>{rec.bookmark_count} Community Bookmarks (weight: 0.4)</span>
                  </div>
                </div>
              </div>

              <Link
                href={`/papers/${rec.paper_id}`}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-[#0B2B64] hover:bg-blue-800 text-white font-medium text-xs whitespace-nowrap shadow-sm self-start md:self-auto"
              >
                <span>Read Paper</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

