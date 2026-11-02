import Link from 'next/link';
import { useRouter } from 'next/router';
import { BookOpen, Database, Sparkles, Award, FileText, Activity } from 'lucide-react';

export default function Navbar() {
  const router = useRouter();

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: Activity },
    { href: '/papers', label: 'Explore Papers', icon: BookOpen },
    { href: '/authors', label: 'Authors & H-Index', icon: Award },
    { href: '/reviews', label: 'Peer Reviews', icon: FileText },
    { href: '/recommendations', label: 'AI Recommender', icon: Sparkles },
    { href: '/dbms-lab', label: 'DBMS SQL Console', icon: Database, highlight: true },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#0B2B64] text-white shadow-md border-b border-blue-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-white shadow-md text-lg">
              PES
            </div>
            <div>
              <div className="font-bold text-lg leading-tight tracking-wide group-hover:text-amber-300 transition-colors">
                Academic Research Portal
              </div>
              <div className="text-xs text-blue-200">
                PostgreSQL • pgvector • NoSQL JSONB
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = router.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    link.highlight
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold shadow-sm ml-2'
                      : isActive
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-900/80 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Student Profile / SRN Badge */}
          <div className="flex items-center space-x-3 border-l border-blue-800/80 pl-4">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-white">Adarsh S. Madli</div>
              <div className="text-[10px] text-amber-300 font-mono">PES2UG24CS028</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-700 border border-blue-500 flex items-center justify-center text-xs font-bold text-white">
              AM
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile nav bar */}
      <div className="md:hidden flex overflow-x-auto px-4 py-2 bg-blue-950/70 border-t border-blue-900 text-xs space-x-2">
        {navLinks.map((link) => {
          const isActive = router.pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap px-3 py-1 rounded ${
                isActive ? 'bg-blue-700 text-white font-bold' : 'text-blue-200'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}

