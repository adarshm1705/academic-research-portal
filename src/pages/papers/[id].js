import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Bookmark, 
  Sparkles, 
  TrendingUp, 
  Star, 
  Award, 
  ExternalLink, 
  FileText, 
  GitFork, 
  CheckCircle,
  PlusCircle,
  Quote
} from 'lucide-react';

export default function PaperDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [triggerMsg, setTriggerMsg] = useState(null);
  const [selectedCitingPaper, setSelectedCitingPaper] = useState('5');

  const fetchPaper = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/papers/${id}`);
      const json = await res.json();
      if (json.paper) setData(json.paper);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaper();
  }, [id]);

  const toggleBookmark = async () => {
    try {
      const res = await fetch(`/api/papers/${id}/bookmark`, { method: 'POST' });
      const json = await res.json();
      setData(prev => ({
        ...prev,
        is_bookmarked: json.bookmarked,
        bookmark_count: json.bookmarked ? prev.bookmark_count + 1 : Math.max(0, prev.bookmark_count - 1)
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleTestCitationTrigger = async () => {
    try {
      const res = await fetch(`/api/papers/${id}/cite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ citing_paper_id: Number(selectedCitingPaper) })
      });
      const json = await res.json();
      if (res.ok) {
        setTriggerMsg(json.message);
        fetchPaper();
        setTimeout(() => setTriggerMsg(null), 5000);
      } else {
        alert(json.error || 'Failed to add citation');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-slate-400">Loading research paper metadata...</div>;
  }

  if (!data) {
    return <div className="text-center py-20 text-slate-500">Paper not found.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/papers"
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Papers</span>
        </Link>
      </div>

      {/* Main Paper Header Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
              {data.venue}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              {data.track_name}
            </span>
            <span className="text-xs text-slate-400">
              Published: {data.publication_date}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={toggleBookmark}
              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                data.is_bookmarked
                  ? 'bg-amber-50 border-amber-300 text-amber-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${data.is_bookmarked ? 'fill-amber-500 text-amber-500' : ''}`} />
              <span>{data.is_bookmarked ? 'Bookmarked' : 'Bookmark'}</span>
            </button>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
          {data.title}
        </h1>

        {/* Authors Badges */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          {data.authors?.map((author) => (
            <div
              key={author.author_id}
              className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs"
            >
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <div>
                <span className="font-semibold text-slate-800">{author.name}</span>
                <span className="text-slate-400 ml-1.5 font-normal">({author.institution_name})</span>
              </div>
            </div>
          ))}
        </div>

        {/* Abstract */}
        <div className="space-y-2 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Abstract</h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {data.abstract}
          </p>
        </div>

        {/* Keywords */}
        {data.keywords && (
          <div className="flex flex-wrap gap-1.5 pt-2">
            {data.keywords.split(',').map((kw, idx) => (
              <span
                key={idx}
                className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 font-mono"
              >
                #{kw.trim()}
              </span>
            ))}
          </div>
        )}

        {/* Live Metrics Bar */}
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-slate-700">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="font-bold text-slate-900 text-sm">{data.citation_count}</span>
              <span className="text-slate-500">Citations</span>
            </div>

            <div className="flex items-center space-x-2 text-slate-700">
              <Quote className="w-4 h-4 text-purple-600" />
              <span className="font-bold text-slate-900 text-sm">{data.citing_papers?.length || 0}</span>
              <span className="text-slate-500">Inbound Citations</span>
            </div>

            <div className="font-mono text-slate-500 text-[11px]">
              DOI: <span className="text-blue-700 select-all">{data.doi}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Trigger Verification Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wide">
                DBMS Trigger Verification
              </span>
              <span className="text-xs font-mono text-blue-200">trg_increment_citation_count</span>
            </div>
            <p className="text-xs text-blue-100 mt-1">
              Insert a new citation into the <code className="font-mono text-amber-300">citations</code> table to test the automatic <code className="font-mono text-amber-300">citation_count</code> increment trigger.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={selectedCitingPaper}
              onChange={(e) => setSelectedCitingPaper(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg bg-blue-950 border border-blue-700 text-white text-xs"
            >
              <option value="5">Citing Paper #5 (Multi-Agent Architecture)</option>
              <option value="6">Citing Paper #6 (Decoupled Storage & Compute)</option>
            </select>
            <button
              onClick={handleTestCitationTrigger}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow"
            >
              Fire Citation Trigger
            </button>
          </div>
        </div>

        {triggerMsg && (
          <div className="p-2.5 rounded bg-emerald-950/80 border border-emerald-500 text-emerald-200 text-xs flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{triggerMsg}</span>
          </div>
        )}
      </div>

      {/* Grid: Semantic Vectors & Citation Network */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Vector Similarity Recommendations (pgvector) */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Conceptually Similar Papers (pgvector Cosine Search)</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
              IVFFlat Index
            </span>
          </div>

          <div className="space-y-3">
            {data.similar_papers?.length === 0 ? (
              <div className="text-xs text-slate-400">No similarity neighbors computed.</div>
            ) : (
              data.similar_papers?.map((sim) => (
                <div
                  key={sim.paper_id}
                  className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-emerald-700">
                      Similarity: {(sim.cosine_similarity * 100).toFixed(1)}%
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Cosine Distance: {sim.distance}
                    </span>
                  </div>
                  <Link
                    href={`/papers/${sim.paper_id}`}
                    className="font-bold text-slate-900 hover:text-blue-700 block transition-colors"
                  >
                    {sim.title}
                  </Link>
                  <div className="text-[11px] text-slate-500">{sim.venue}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Citation Graph (Inbound & Outbound) */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <GitFork className="w-4 h-4 text-purple-600" />
            <span>Citation Network (Directed Graph)</span>
          </h3>

          <div className="space-y-3">
            <div>
              <div className="text-xs font-semibold text-slate-700 mb-2">
                Papers that Cite this Work ({data.citing_papers?.length || 0}):
              </div>
              {data.citing_papers?.length === 0 ? (
                <div className="text-xs text-slate-400 italic">No inbound citations yet.</div>
              ) : (
                <div className="space-y-2">
                  {data.citing_papers?.map((cp) => (
                    <div key={cp.paper_id} className="p-2.5 rounded bg-purple-50/50 border border-purple-200 text-xs">
                      <Link href={`/papers/${cp.paper_id}`} className="font-medium text-purple-950 hover:underline">
                        {cp.title}
                      </Link>
                      <div className="text-[10px] text-purple-700 mt-0.5">{cp.venue}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-semibold text-slate-700 mb-2">
                References / Outbound Citations ({data.cited_papers?.length || 0}):
              </div>
              {data.cited_papers?.length === 0 ? (
                <div className="text-xs text-slate-400 italic">No references recorded.</div>
              ) : (
                <div className="space-y-2">
                  {data.cited_papers?.map((cp) => (
                    <div key={cp.paper_id} className="p-2.5 rounded bg-slate-50 border border-slate-200 text-xs">
                      <Link href={`/papers/${cp.paper_id}`} className="font-medium text-slate-800 hover:underline">
                        {cp.title}
                      </Link>
                      <div className="text-[10px] text-slate-500 mt-0.5">{cp.venue}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Peer Reviews & NoSQL Rubrics */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
            <span>Peer Reviews & Evaluation Rubrics (JSONB Documents)</span>
          </h3>
          <span className="text-xs font-medium text-slate-500">
            {data.reviews?.length || 0} Reviews Completed
          </span>
        </div>

        {data.reviews?.length === 0 ? (
          <div className="text-xs text-slate-400 py-4">No peer reviews submitted yet.</div>
        ) : (
          <div className="space-y-4">
            {data.reviews?.map((rev) => (
              <div key={rev.review_id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-slate-800">{rev.reviewer_name}</span>
                    <span className="text-slate-400 ml-1.5 font-normal">({rev.expertise})</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded font-bold text-slate-900 bg-amber-100 border border-amber-300">
                      Score: {rev.rating} / 10
                    </span>
                    <span className={`px-2 py-0.5 rounded font-semibold capitalize ${
                      rev.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rev.status}
                    </span>
                  </div>
                </div>

                <div className="text-slate-700 bg-white p-3 rounded border border-slate-200 leading-relaxed">
                  <span className="font-semibold text-slate-900">Recommendation: </span>
                  {rev.recommendation}
                </div>

                {/* Structured JSONB Comments */}
                {rev.comments?.map((c) => (
                  <div key={c.comment_id} className="p-3 rounded bg-blue-50/60 border border-blue-200 space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-blue-900">
                        {c.comment_data?.reviewer_badge || 'Reviewer Rubric'}
                      </span>
                      <span className="font-mono text-blue-600 text-[10px]">JSONB Document</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white p-2 rounded border border-blue-100 text-center">
                        <div className="text-[10px] text-slate-500">Novelty</div>
                        <div className="font-bold text-blue-800 text-xs">{c.comment_data?.rubric?.novelty} / 10</div>
                      </div>
                      <div className="bg-white p-2 rounded border border-blue-100 text-center">
                        <div className="text-[10px] text-slate-500">Methodology</div>
                        <div className="font-bold text-blue-800 text-xs">{c.comment_data?.rubric?.methodology} / 10</div>
                      </div>
                      <div className="bg-white p-2 rounded border border-blue-100 text-center">
                        <div className="text-[10px] text-slate-500">Reproducibility</div>
                        <div className="font-bold text-blue-800 text-xs">{c.comment_data?.rubric?.reproducibility} / 10</div>
                      </div>
                    </div>

                    <div className="text-slate-600 text-[11px] italic">
                      "{c.comment_data?.feedback}"
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

