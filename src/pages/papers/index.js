import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  Search, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  ArrowUpRight, 
  Plus, 
  Layers, 
  TrendingUp, 
  Star, 
  FileText,
  SlidersHorizontal,
  X
} from 'lucide-react';

export default function PapersPage() {
  const router = useRouter();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [searchMode, setSearchMode] = useState('vector'); // 'vector' | 'text'
  const [trackId, setTrackId] = useState('all');
  const [sort, setSort] = useState('citations');
  const [modalOpen, setModalOpen] = useState(false);

  // New paper form state
  const [newTitle, setNewTitle] = useState('');
  const [newAbstract, setNewAbstract] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [newVenue, setNewVenue] = useState('VLDB 2026 Proceedings');
  const [newTrack, setNewTrack] = useState('1');

  const fetchPapers = async (searchQ = query, mode = searchMode, trk = trackId, srt = sort) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQ) params.append('q', searchQ);
      if (mode) params.append('mode', mode);
      if (trk && trk !== 'all') params.append('track_id', trk);
      if (srt) params.append('sort', srt);

      const res = await fetch(`/api/papers?${params.toString()}`);
      const data = await res.json();
      if (data.papers) {
        setPapers(data.papers);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady) {
      const q = router.query.q || '';
      const m = router.query.mode || 'vector';
      setQuery(q);
      setSearchMode(m);
      fetchPapers(q, m, trackId, sort);
    }
  }, [router.isReady, router.query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchPapers(query, searchMode, trackId, sort);
  };

  const toggleBookmark = async (paperId) => {
    try {
      const res = await fetch(`/api/papers/${paperId}/bookmark`, { method: 'POST' });
      const data = await res.json();
      setPapers(prev => prev.map(p => {
        if (p.paper_id === paperId) {
          const newCount = data.bookmarked ? p.bookmark_count + 1 : Math.max(0, p.bookmark_count - 1);
          return { ...p, bookmark_count: newCount, is_bookmarked: data.bookmarked };
        }
        return p;
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePaper = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          abstract: newAbstract,
          keywords: newKeywords,
          venue: newVenue,
          track_id: Number(newTrack),
          author_ids: [1, 2], // Adarsh & Dr. Shilpa S
          submitted_by: 2
        })
      });
      if (res.ok) {
        setModalOpen(false);
        setNewTitle('');
        setNewAbstract('');
        setNewKeywords('');
        fetchPapers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <FileText className="w-6 h-6 text-[#0B2B64]" />
            <span>Academic Research Papers</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Query across relational tables with full-text GIN search or semantic similarity via pgvector
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-lg bg-[#0B2B64] hover:bg-blue-800 text-white font-medium text-xs shadow-sm transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Research Paper</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                searchMode === 'vector'
                  ? 'Semantic query: e.g. "hybrid indexing in postgresql" or "learned query execution"'
                  : 'Full-text keywords: vector, database, optimizer, benchmark...'
              }
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 bg-slate-50/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSearchMode('vector');
                  fetchPapers(query, 'vector', trackId, sort);
                }}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  searchMode === 'vector' ? 'bg-white shadow text-blue-700 font-bold' : 'text-slate-600'
                }`}
              >
                Vector (pgvector)
              </button>
              <button
                type="button"
                onClick={() => {
                  setSearchMode('text');
                  fetchPapers(query, 'text', trackId, sort);
                }}
                className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                  searchMode === 'text' ? 'bg-white shadow text-blue-700 font-bold' : 'text-slate-600'
                }`}
              >
                Full-Text (GIN)
              </button>
            </div>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-[#0B2B64] hover:bg-blue-800 text-white font-medium text-xs transition-colors shadow-sm"
            >
              Filter
            </button>
          </div>
        </form>

        {/* Sub-filters: Conference Track & Sort */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Conference Track:</span>
            <select
              value={trackId}
              onChange={(e) => {
                setTrackId(e.target.value);
                fetchPapers(query, searchMode, e.target.value, sort);
              }}
              className="px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="all">All Tracks</option>
              <option value="1">Vector Databases & Semantic Retrieval (VLDB)</option>
              <option value="2">AI-Driven DBMS Query Optimization (SIGMOD)</option>
              <option value="3">Deep Learning & Foundation Models (NeurIPS)</option>
              <option value="4">Distributed Data & Stream Processing (ICDE)</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-slate-500 font-medium">Sort By:</span>
            <select
              value={searchMode === 'vector' && query ? 'similarity' : sort}
              onChange={(e) => {
                setSort(e.target.value);
                fetchPapers(query, searchMode, trackId, e.target.value);
              }}
              className="px-2.5 py-1 rounded border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              {searchMode === 'vector' && query && (
                <option value="similarity">Semantic Similarity (Highest)</option>
              )}
              <option value="citations">Citation Count (Highest)</option>
              <option value="rating">Review Rating (Highest)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Papers List */}
      {loading ? (
        <div className="text-center py-16 text-slate-400">Loading academic papers...</div>
      ) : papers.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">No papers matched your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {papers.map((paper) => (
            <div
              key={paper.paper_id}
              className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm hover:border-blue-300 transition-all space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {paper.venue || 'Academic Venue'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-600">
                      {paper.track_name || 'General Track'}
                    </span>
                    {paper.cosine_similarity !== undefined && (
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        <span>Cosine Sim: {(paper.cosine_similarity * 100).toFixed(1)}%</span>
                      </span>
                    )}
                  </div>

                  <Link href={`/papers/${paper.paper_id}`}>
                    <h2 className="text-lg font-bold text-slate-900 hover:text-blue-700 transition-colors cursor-pointer mt-1">
                      {paper.title}
                    </h2>
                  </Link>
                </div>

                <button
                  onClick={() => toggleBookmark(paper.paper_id)}
                  title="Bookmark Paper"
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-amber-500 transition-colors"
                >
                  <Bookmark className={`w-5 h-5 ${paper.bookmark_count > 0 ? 'text-amber-500 fill-amber-500' : ''}`} />
                </button>
              </div>

              {/* Authors List */}
              <div className="text-xs text-slate-600 flex flex-wrap items-center gap-1.5">
                <span className="font-semibold text-slate-500">Authors:</span>
                {paper.authors?.map((a, i) => (
                  <span key={a.author_id} className="inline-flex items-center">
                    <span className="text-slate-800 font-medium">{a.name}</span>
                    {i < paper.authors.length - 1 && <span className="text-slate-400 ml-1">,</span>}
                  </span>
                ))}
              </div>

              {/* Abstract */}
              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {paper.abstract}
              </p>

              {/* Keywords */}
              {paper.keywords && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {paper.keywords.split(',').map((kw, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono"
                    >
                      #{kw.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Bottom Metadata & Links */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 text-slate-700 font-medium">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    <span>{paper.citation_count} Citations</span>
                  </div>

                  {paper.avg_rating && (
                    <div className="flex items-center space-x-1 text-slate-700 font-medium">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                      <span>{paper.avg_rating} / 10 Peer Rating</span>
                    </div>
                  )}

                  <span className="text-slate-400 font-mono text-[11px]">
                    DOI: {paper.doi}
                  </span>
                </div>

                <Link
                  href={`/papers/${paper.paper_id}`}
                  className="inline-flex items-center space-x-1 font-semibold text-blue-700 hover:text-blue-900 transition-colors"
                >
                  <span>Paper Graph & Reviews</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Submit Paper Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900">Submit New Academic Paper</h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePaper} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Paper Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Distributed In-Memory Key-Value Stores"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Abstract</label>
                <textarea
                  required
                  rows={4}
                  value={newAbstract}
                  onChange={(e) => setNewAbstract(e.target.value)}
                  placeholder="Summarize the core technical contribution, experimental setup, and conclusions..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Conference Track</label>
                  <select
                    value={newTrack}
                    onChange={(e) => setNewTrack(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  >
                    <option value="1">Vector Databases & Semantic Retrieval</option>
                    <option value="2">AI-Driven DBMS Query Optimization</option>
                    <option value="3">Deep Learning & Foundation Models</option>
                    <option value="4">Distributed Data & Stream Processing</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Venue</label>
                  <input
                    type="text"
                    value={newVenue}
                    onChange={(e) => setNewVenue(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keywords (comma-separated)</label>
                <input
                  type="text"
                  value={newKeywords}
                  onChange={(e) => setNewKeywords(e.target.value)}
                  placeholder="distributed dbms, vector search, postgresql"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#0B2B64] hover:bg-blue-800 text-white font-semibold"
                >
                  Submit to Portal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

