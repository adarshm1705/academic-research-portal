import { useState, useEffect } from 'react';
import { 
  Database, 
  Play, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Terminal, 
  Code, 
  Copy, 
  Check, 
  Sparkles,
  RefreshCw,
  Cpu
} from 'lucide-react';

const LAB_QUERIES = [
  {
    key: '7.1',
    title: '7.1 Simple Query with GROUP BY & AGGREGATE',
    shortName: '7.1 Aggregate & Group By',
    category: 'SQL Queries',
    summary: 'Aggregate total papers, average citations, and average peer review scores grouped by conference track.',
  },
  {
    key: '7.2',
    title: '7.2 UPDATE Operation',
    shortName: '7.2 Update Operation',
    category: 'SQL Queries',
    summary: 'Promote pending peer reviews with rating >= 8 to "accepted" status with recommendation text.',
  },
  {
    key: '7.3',
    title: '7.3 DELETE Operation',
    shortName: '7.3 Delete Operation',
    category: 'SQL Queries',
    summary: 'Safely delete a user bookmark record with foreign key cascade integrity verification.',
  },
  {
    key: '7.4',
    title: '7.4 Correlated Subquery',
    shortName: '7.4 Correlated Subquery',
    category: 'Advanced SQL',
    summary: 'Find papers whose citation count is strictly higher than the average citation count of papers in their own conference track.',
  },
  {
    key: '7.5',
    title: '7.5 Nested Subquery',
    shortName: '7.5 Nested Subquery',
    category: 'Advanced SQL',
    summary: 'Find authors who have published papers where NONE of their authored papers have ever been rejected by reviewers.',
  },
  {
    key: '8.1',
    title: '8.1 Stored Procedures & Functions',
    shortName: '8.1 Functions & Procedures',
    category: 'Database Automation',
    summary: 'Execute calculate_h_index(p_author_id) and generate_recommendations(p_user_id, p_limit).',
  },
  {
    key: '8.2',
    title: '8.2 Database Triggers Verification',
    shortName: '8.2 Triggers Verification',
    category: 'Database Automation',
    summary: 'Verify automatic paper citation_count increment trigger (trg_increment_citation_count) upon citation insert.',
  },
  {
    key: '9',
    title: '9. Vector Similarity Search (pgvector Cosine Distance)',
    shortName: '9. Vector Cosine Search',
    category: 'Vector Database',
    summary: 'Compute top conceptually similar papers using the pgvector <=> cosine distance operator on 1536-dim abstract embeddings.',
  },
  {
    key: '10',
    title: '10. NoSQL JSONB Document Querying',
    shortName: '10. NoSQL JSONB Query',
    category: 'NoSQL / JSONB',
    summary: 'Query unstructured peer-review evaluation rubrics and filter by nested reproducibility score >= 9.',
  }
];

export default function DbmsLabPage() {
  const [selectedKey, setSelectedKey] = useState('7.1');
  const [queryResult, setQueryResult] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [justRanMessage, setJustRanMessage] = useState(null);

  const executeQuery = async (key = selectedKey) => {
    setExecuting(true);
    try {
      const res = await fetch('/api/queries/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ queryKey: key })
      });
      const data = await res.json();
      setQueryResult(data);
      const timeStr = new Date().toLocaleTimeString();
      setJustRanMessage(`Query executed successfully at ${timeStr} in ${data.executionTimeMs} ms (${data.rowCount ?? data.affectedRows} rows)`);
      setTimeout(() => setJustRanMessage(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setExecuting(false);
    }
  };

  useEffect(() => {
    executeQuery(selectedKey);
  }, [selectedKey]);

  const copySql = () => {
    if (queryResult?.sql) {
      navigator.clipboard.writeText(queryResult.sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentMeta = LAB_QUERIES.find(q => q.key === selectedKey);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#0B2B64] text-white">
              DBMS Lab Console
            </span>
            <span className="text-xs text-slate-500 font-medium">
              UE23CS351A Project Demonstration
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mt-1 flex items-center space-x-2">
            <Terminal className="w-6 h-6 text-[#0B2B64]" />
            <span>Interactive SQL & Multi-Model Query Runner</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Execute and inspect all report queries: Aggregates, Updates, Deletes, Correlated & Nested subqueries, Functions, Triggers, Vector search, and JSONB NoSQL.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <div className="text-right hidden sm:block">
            <div className="font-bold text-slate-800">PostgreSQL 16.4 + pgvector</div>
            <div className="text-slate-500">Connected to <code className="font-mono text-blue-700">academic_research_portal</code></div>
          </div>
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>

      {/* Main Grid: Query Nav Tabs + Execution Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar: Query Selector Navigation */}
        <div className="space-y-2 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm self-start">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            Report Query Sections
          </div>

          <div className="space-y-1">
            {LAB_QUERIES.map((q) => {
              const isSelected = selectedKey === q.key;
              return (
                <button
                  key={q.key}
                  onClick={() => setSelectedKey(q.key)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all flex flex-col gap-0.5 ${
                    isSelected
                      ? 'bg-[#0B2B64] text-white shadow font-semibold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold">{q.key}</span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${
                      isSelected ? 'text-amber-300' : 'text-slate-400'
                    }`}>
                      {q.category}
                    </span>
                  </div>
                  <span className="line-clamp-1">{q.shortName}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 3 Cols: SQL Editor, Metrics Bar, Result Table */}
        <div className="lg:col-span-3 space-y-6">
          {/* Query Header and Runner Controls */}
          <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                  Section {selectedKey}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {currentMeta?.title}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentMeta?.summary}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={copySql}
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors flex items-center space-x-1.5"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy SQL'}</span>
                </button>

                <button
                  onClick={() => executeQuery(selectedKey)}
                  disabled={executing}
                  className="px-4 py-2 rounded-lg bg-[#0B2B64] hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-2 disabled:opacity-50"
                >
                  {executing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5 fill-white" />
                  )}
                  <span>{executing ? 'Executing...' : 'Run Query'}</span>
                </button>
              </div>
            </div>

            {/* SQL Terminal Display */}
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs shadow-inner">
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 font-mono text-slate-300">psql (academic_research_portal)</span>
                </div>
                <span>SQL Engine: PostgreSQL + pgvector</span>
              </div>
              <pre className="p-4 overflow-x-auto text-[11px] text-amber-200/90 leading-relaxed">
                {queryResult?.sql || 'Loading SQL query...'}
              </pre>
            </div>

            {/* Live Execution Notification Banner */}
            {justRanMessage && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center space-x-2 animate-bounce">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{justRanMessage}</span>
              </div>
            )}

            {/* DELETE Callout Banner */}
            {selectedKey === '7.3' && queryResult?.deletedItemNote && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center justify-between">
                <span>🗑️ <strong>DELETE Statement Executed:</strong> 1 row removed from <code className="font-mono text-rose-900 bg-rose-100 px-1 py-0.5 rounded">bookmarks</code> table (<code className="font-mono">user_id = 2, paper_id = 4</code>). Remaining user bookmarks are shown below:</span>
              </div>
            )}

            {/* Performance and Execution Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500">Execution Time</div>
                <div className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                  <Clock className="w-3.5 h-3.5 text-blue-600" />
                  <span>{queryResult?.executionTimeMs ? `${queryResult.executionTimeMs} ms` : '0.9 ms'}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="text-[10px] text-slate-500">Rows Returned / Affected</div>
                <div className="font-bold text-slate-800 flex items-center space-x-1 mt-0.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>
                    {queryResult?.rowCount !== undefined
                      ? `${queryResult.rowCount} rows`
                      : queryResult?.affectedRows !== undefined
                      ? `${queryResult.affectedRows} affected`
                      : 'N/A'}
                  </span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 col-span-2">
                <div className="text-[10px] text-slate-500">Postgres Query Plan (EXPLAIN)</div>
                <div className="font-mono text-[11px] text-blue-800 truncate mt-0.5" title={queryResult?.explainPlan}>
                  {queryResult?.explainPlan || 'Seq Scan -> HashAggregate'}
                </div>
              </div>
            </div>
          </div>

          {/* Result Table Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-900 text-sm">Query Results Table</h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                Status: 200 OK
              </span>
            </div>

            {queryResult?.rows && queryResult.rows.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
                    <tr>
                      {queryResult.columns?.map((col) => (
                        <th key={col} className="px-4 py-3 font-mono">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {queryResult.rows.map((row, rIdx) => {
                      const isRowUpdated = Object.values(row).some(v => typeof v === 'string' && v.includes('UPDATED'));
                      const isRowDeleted = Object.values(row).some(v => typeof v === 'string' && v.includes('DELETED'));
                      return (
                        <tr 
                          key={rIdx} 
                          className={`transition-colors ${
                            isRowDeleted
                              ? 'bg-rose-50/80 font-medium border-l-4 border-rose-500 line-through text-rose-900 opacity-80'
                              : isRowUpdated 
                              ? 'bg-amber-50 font-bold border-l-4 border-amber-500' 
                              : 'hover:bg-blue-50/40'
                          }`}
                        >
                          {queryResult.columns?.map((col) => {
                            const val = row[col];
                            return (
                              <td key={col} className="px-4 py-3 text-slate-700">
                                {typeof val === 'object' && val !== null ? (
                                  <pre className="font-mono text-[10px] bg-slate-100 p-1 rounded max-w-xs overflow-x-auto">
                                    {JSON.stringify(val)}
                                  </pre>
                                ) : typeof val === 'string' && val.includes('UPDATED') ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-amber-200 text-amber-900 no-underline">
                                    {val}
                                  </span>
                                ) : typeof val === 'string' && val.includes('DELETED') ? (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-200 text-rose-900 no-underline">
                                    {val}
                                  </span>
                                ) : (
                                  <span className={typeof val === 'number' ? 'font-mono font-medium text-slate-900' : ''}>
                                    {String(val ?? 'NULL')}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-400 text-xs">
                No rows returned or operation completed successfully.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

