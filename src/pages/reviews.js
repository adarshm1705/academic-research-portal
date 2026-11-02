import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Star, CheckCircle, Clock, Plus, X, Send } from 'lucide-react';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form state
  const [paperId, setPaperId] = useState('1');
  const [reviewerId, setReviewerId] = useState('1');
  const [rating, setRating] = useState('9');
  const [recommendation, setRecommendation] = useState('');
  const [novelty, setNovelty] = useState('9');
  const [methodology, setMethodology] = useState('9');
  const [reproducibility, setReproducibility] = useState('10');
  const [feedback, setFeedback] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/reviews');
      const data = await res.json();
      if (data.reviews) setReviews(data.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paper_id: Number(paperId),
          reviewer_id: Number(reviewerId),
          rating: Number(rating),
          recommendation,
          status: Number(rating) >= 7 ? 'accepted' : 'pending',
          comment_data: {
            rubric: {
              novelty: Number(novelty),
              methodology: Number(methodology),
              reproducibility: Number(reproducibility)
            },
            feedback,
            reviewer_badge: 'Peer Review Committee'
          }
        })
      });

      if (res.ok) {
        setModalOpen(false);
        setRecommendation('');
        setFeedback('');
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-[#0B2B64]" />
            <span>Peer Review & Evaluation Portal</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Unstructured qualitative feedback and rubric dimensions persisted in PostgreSQL <code className="font-mono text-blue-700">JSONB</code> document columns
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#0B2B64] hover:bg-blue-800 text-white font-medium text-xs shadow-sm transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Peer Review</span>
        </button>
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading peer reviews...</div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.review_id}
              className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-3"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    {rev.venue}
                  </span>
                  <Link href={`/papers/${rev.paper_id}`}>
                    <h2 className="text-base font-bold text-slate-900 hover:text-blue-700 transition-colors mt-1">
                      {rev.paper_title}
                    </h2>
                  </Link>
                  <div className="text-xs text-slate-500">
                    Reviewer: <span className="font-medium text-slate-700">{rev.reviewer_name}</span> ({rev.reviewer_email})
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>Rating: {rev.rating} / 10</span>
                  </div>

                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider ${
                    rev.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {rev.status}
                  </span>
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <span className="font-semibold text-slate-900">Summary: </span>
                {rev.recommendation}
              </div>

              {/* NoSQL JSONB Comments */}
              {rev.comments?.map((c) => (
                <div key={c.comment_id} className="p-3.5 rounded-lg bg-blue-50/50 border border-blue-200 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-blue-900 font-bold">
                    <span>{c.comment_data?.reviewer_badge || 'Evaluation Rubric'}</span>
                    <span className="font-mono text-blue-600 text-[10px]">JSONB Document</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-white p-2 rounded border border-blue-100">
                      <div className="text-[10px] text-slate-500">Novelty</div>
                      <div className="font-bold text-blue-800">{c.comment_data?.rubric?.novelty} / 10</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-blue-100">
                      <div className="text-[10px] text-slate-500">Methodology</div>
                      <div className="font-bold text-blue-800">{c.comment_data?.rubric?.methodology} / 10</div>
                    </div>
                    <div className="bg-white p-2 rounded border border-blue-100">
                      <div className="text-[10px] text-slate-500">Reproducibility</div>
                      <div className="font-bold text-blue-800">{c.comment_data?.rubric?.reproducibility} / 10</div>
                    </div>
                  </div>

                  <div className="text-slate-600 italic pt-1">
                    "{c.comment_data?.feedback}"
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Review Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Submit Peer Review & Rubric</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Paper</label>
                  <select
                    value={paperId}
                    onChange={(e) => setPaperId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  >
                    <option value="1">Paper #1: Vector Indexing & ANN</option>
                    <option value="2">Paper #2: Semantic Citation Networks</option>
                    <option value="3">Paper #3: Learned Cost Models</option>
                    <option value="4">Paper #4: Hybrid Full-Text & Vector</option>
                    <option value="5">Paper #5: Multi-Agent Architecture</option>
                    <option value="6">Paper #6: Decoupled Storage & Compute</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reviewer Identity</label>
                  <select
                    value={reviewerId}
                    onChange={(e) => setReviewerId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  >
                    <option value="1">Prof. Sandesh B J (PES University)</option>
                    <option value="2">Dr. Michael Stonebraker (MIT)</option>
                    <option value="3">Dr. Andrew Ng (Stanford)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Overall Rating (1 - 10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  required
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Recommendation Summary</label>
                <textarea
                  required
                  rows={2}
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                  placeholder="e.g. Strongly recommended for presentation due to exceptional benchmarks."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              {/* NoSQL JSONB Rubric Fields */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                  NoSQL JSONB Rubric Dimensions
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Novelty (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={novelty}
                      onChange={(e) => setNovelty(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Methodology (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={methodology}
                      onChange={(e) => setMethodology(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500 mb-0.5">Reproducibility (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={reproducibility}
                      onChange={(e) => setReproducibility(e.target.value)}
                      className="w-full px-2 py-1 border rounded text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-500 mb-0.5">Qualitative Feedback</label>
                  <input
                    type="text"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="e.g. Excellent experimental baseline, source code readily reproducible."
                    className="w-full px-2 py-1.5 border rounded text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0B2B64] hover:bg-blue-800 text-white font-semibold flex items-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Review</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

