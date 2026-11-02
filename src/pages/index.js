import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Award, 
  Layers, 
  Database, 
  Search, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  FileCheck,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function Home() {
  const [stats, setStats] = useState({
    papersCount: 6,
    citationsTotal: 166,
    authorsCount: 7,
    reviewsCount: 6,
    tracksCount: 4
  });
  const [activities, setActivities] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('vector'); // 'vector' | 'text'

  useEffect(() => {
    fetch('/api/activity')
      .then(res => res.json())
      .then(data => {
        if (data.activities) setActivities(data.activities.slice(0, 6));
      })
      .catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0B2B64] via-blue-900 to-indigo-900 text-white p-8 md:p-10 shadow-xl border border-blue-800">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-800/80 border border-blue-600/50 text-xs text-amber-300 font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>UE23CS351A – DBMS Mini Project</span>
            <span className="text-white">•</span>
            <span>SRN: PES2UG24CS028</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            AI-Powered Academic <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400">
              Research Portal
            </span>
          </h1>

          <p className="mt-4 text-blue-100 text-sm md:text-base leading-relaxed">
            A next-generation research paper discovery and peer-review platform powered by 
            <span className="font-semibold text-white"> PostgreSQL</span> for relational integrity, 
            <span className="font-semibold text-white"> pgvector</span> for semantic similarity search over abstract embeddings, 
            and <span className="font-semibold text-white"> NoSQL JSONB</span> for unstructured review rubrics and event streams.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/papers"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm shadow-md transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Explore Research Papers</span>
            </Link>

            <Link
              href="/dbms-lab"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-blue-800/90 hover:bg-blue-700 text-white font-medium text-sm border border-blue-600 transition-all"
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span>Interactive SQL Lab Console</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-4 right-8 hidden lg:block opacity-20 text-white font-mono text-xs">
          <pre>{`SELECT p.paper_id, p.title\nFROM papers p\nJOIN paper_embeddings pe\nORDER BY pe.embedding <=> target.embedding\nLIMIT 5;`}</pre>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.papersCount}</div>
            <div className="text-xs text-slate-500 font-medium">Research Papers</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.citationsTotal}</div>
            <div className="text-xs text-slate-500 font-medium">Total Citations</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.authorsCount}</div>
            <div className="text-xs text-slate-500 font-medium">Faculty Authors</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{stats.tracksCount}</div>
            <div className="text-xs text-slate-500 font-medium">Conference Tracks</div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200/80 shadow-sm flex items-center space-x-4 col-span-2 sm:col-span-1">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">1536-D</div>
            <div className="text-xs text-slate-500 font-medium">pgvector Index</div>
          </div>
        </div>
      </div>

      {/* Semantic Search Quick Box */}
      <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Semantic Vector Search & Natural Language Query</span>
            </h2>
            <p className="text-xs text-slate-500">
              Performs cosine distance search over high-dimensional abstract embeddings (pgvector IVFFlat)
            </p>
          </div>

          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1 text-xs">
            <button
              onClick={() => setSearchMode('vector')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                searchMode === 'vector' ? 'bg-white shadow text-blue-700 font-bold' : 'text-slate-600'
              }`}
            >
              Vector Cosine (pgvector)
            </button>
            <button
              onClick={() => setSearchMode('text')}
              className={`px-3 py-1 rounded-md font-medium transition-all ${
                searchMode === 'text' ? 'bg-white shadow text-blue-700 font-bold' : 'text-slate-600'
              }`}
            >
              Full-Text tsvector (GIN)
            </button>
          </div>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (searchQuery.trim()) {
              window.location.href = `/papers?q=${encodeURIComponent(searchQuery)}&mode=${searchMode}`;
            }
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                searchMode === 'vector'
                  ? 'e.g. high dimensional indexing in postgresql, learned joins, distributed consensus...'
                  : 'Search by keywords: vector, database, optimizer, benchmark...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent bg-slate-50/50"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-lg bg-[#0B2B64] hover:bg-blue-800 text-white font-medium text-sm transition-colors shadow-sm flex items-center space-x-2"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
          <span className="font-semibold text-slate-700">Try conceptual samples:</span>
          <button
            onClick={() => setSearchQuery('approximate nearest neighbor search in relational databases')}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors"
          >
            ANN in Relational DB
          </button>
          <button
            onClick={() => setSearchQuery('reinforcement learning cost model for join queries')}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors"
          >
            Learned SQL Cost Models
          </button>
          <button
            onClick={() => setSearchQuery('automated peer review validation and reproducibility')}
            className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 transition-colors"
          >
            Automated Peer Review
          </button>
        </div>
      </div>

      {/* Grid: Database Schema Highlights & Live Audit Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: DBMS Architecture Highlights */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Database className="w-5 h-5 text-blue-700" />
              <span>Multi-Modal Database Architecture</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200">
                <div className="font-semibold text-blue-900 text-sm mb-1 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Relational (PostgreSQL)</span>
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Strict referential integrity, foreign key cascades, 3NF schemas for users, institutions, conference tracks, and citations.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-emerald-50/70 border border-emerald-200">
                <div className="font-semibold text-emerald-900 text-sm mb-1 flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Vector DB (pgvector)</span>
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  1536-dimensional abstract embeddings with IVFFlat cosine distance indexing (<code className="font-mono">&lt;=&gt;</code>) for conceptual similarity retrieval.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200">
                <div className="font-semibold text-amber-900 text-sm mb-1 flex items-center space-x-1.5">
                  <FileCheck className="w-4 h-4 text-amber-600" />
                  <span>NoSQL (JSONB Store)</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Flexible document schemas for peer review evaluation rubrics and JSONB audit event logs in <code className="font-mono">activity_feeds</code>.
                </p>
              </div>
            </div>

            {/* Stored Procedures & Triggers Pill Banner */}
            <div className="p-4 rounded-lg bg-slate-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-semibold text-amber-400">DATABASE AUTOMATION INCLUDED</div>
                <div className="text-sm font-medium">H-Index Function, Recommendation Engine & Auto-Citation Triggers</div>
              </div>
              <Link
                href="/dbms-lab"
                className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs whitespace-nowrap transition-colors"
              >
                Run Lab Queries
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Live Audit Activity Feed (NoSQL JSONB) */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-700" />
              <span>Activity Feed (JSONB)</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
              Live Audit Log
            </span>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[380px] pr-1">
            {activities.length === 0 ? (
              <div className="text-xs text-slate-400 text-center py-6">No recent events recorded.</div>
            ) : (
              activities.map((act) => (
                <div key={act.activity_id} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{act.user_name || 'System User'}</span>
                    <span className="text-[10px] text-slate-400">
                      {new Date(act.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-slate-600">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono text-[10px] mr-1.5">
                      {act.activity_type}
                    </span>
                    {act.details?.title ? (
                      <span className="font-medium text-slate-700">"{act.details.title.slice(0, 45)}..."</span>
                    ) : (
                      <span className="text-slate-600">{act.details?.action || 'Database operation'}</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

