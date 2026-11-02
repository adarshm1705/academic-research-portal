import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Award, BookOpen, TrendingUp, Building, Globe, ChevronDown, ChevronUp, Code } from 'lucide-react';

export default function AuthorsPage() {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedAuthor, setExpandedAuthor] = useState(null);

  useEffect(() => {
    fetch('/api/authors')
      .then(res => res.json())
      .then(data => {
        if (data.authors) setAuthors(data.authors);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Award className="w-6 h-6 text-[#0B2B64]" />
            <span>Academic Authors & H-Index Analytics</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time bibliometric metrics computed using stored function <code className="font-mono text-blue-700">calculate_h_index(p_author_id)</code>
          </p>
        </div>

        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-900 max-w-sm">
          <span className="font-bold">SQL H-Index Definition:</span> An author has index <code className="font-mono font-bold">h</code> if <code className="font-mono font-bold">h</code> of their <code className="font-mono font-bold">N</code> papers have at least <code className="font-mono font-bold">h</code> citations each.
        </div>
      </div>

      {/* SQL Definition Code Box */}
      <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs shadow-sm overflow-x-auto">
        <div className="flex items-center space-x-2 text-amber-400 font-bold mb-2">
          <Code className="w-4 h-4" />
          <span>PostgreSQL Stored Function: calculate_h_index</span>
        </div>
        <pre className="text-slate-300 text-[11px] leading-relaxed">{`CREATE OR REPLACE FUNCTION calculate_h_index(p_author_id BIGINT)
RETURNS INTEGER AS $$
DECLARE h INTEGER := 0;
BEGIN
    SELECT COUNT(*) INTO h
    FROM (
        SELECT p.citation_count, ROW_NUMBER() OVER (ORDER BY p.citation_count DESC) AS rn
        FROM papers p
        JOIN paper_authors pa ON p.paper_id = pa.paper_id
        WHERE pa.author_id = p_author_id
    ) ranked
    WHERE citation_count >= rn;
    RETURN h;
END;
$$ LANGUAGE plpgsql;`}</pre>
      </div>

      {/* Authors Grid */}
      {loading ? (
        <div className="text-center py-20 text-slate-400">Loading author bibliometrics...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {authors.map((author) => {
            const isExpanded = expandedAuthor === author.author_id;
            return (
              <div
                key={author.author_id}
                className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-sm hover:border-blue-300 transition-all space-y-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">{author.name}</h2>
                      <div className="flex items-center space-x-1.5 text-xs text-slate-500 mt-0.5">
                        <Building className="w-3.5 h-3.5 text-blue-600" />
                        <span className="font-medium text-slate-700">{author.institution_name}</span>
                        <span>({author.institution_country})</span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        ORCID: {author.orcid}
                      </div>
                    </div>

                    {/* H-Index Badge */}
                    <div className="text-center px-3 py-2 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 shadow-sm border border-amber-300">
                      <div className="text-[10px] font-bold uppercase tracking-wider">H-INDEX</div>
                      <div className="text-2xl font-black">{author.h_index}</div>
                    </div>
                  </div>

                  {/* Metrics Row */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100 text-xs">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-blue-600" />
                      <div>
                        <div className="text-[10px] text-slate-500">Publications</div>
                        <div className="font-bold text-slate-800 text-sm">{author.paper_count} Papers</div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center space-x-2">
                      <TrendingUp className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div className="text-[10px] text-slate-500">Total Citations</div>
                        <div className="font-bold text-slate-800 text-sm">{author.total_citations} Citations</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Publications Dropdown */}
                <div className="pt-2">
                  <button
                    onClick={() => setExpandedAuthor(isExpanded ? null : author.author_id)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-blue-700 hover:text-blue-900 py-1.5 transition-colors border-t border-slate-100"
                  >
                    <span>View Authored Papers ({author.papers.length})</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <div className="space-y-2 mt-2 pt-2 border-t border-slate-100 text-xs">
                      {author.papers.map((p) => (
                        <div key={p.paper_id} className="p-2.5 rounded bg-slate-50 border border-slate-200">
                          <Link href={`/papers/${p.paper_id}`} className="font-semibold text-slate-900 hover:underline">
                            {p.title}
                          </Link>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                            <span>{p.venue}</span>
                            <span className="font-bold text-blue-700">{p.citation_count} citations</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

