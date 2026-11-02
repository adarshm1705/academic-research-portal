export default function Footer() {
  return (
    <footer className="mt-auto bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-semibold text-slate-200">UE23CS351A – Database Management Systems Mini Project</span>
          <p className="text-slate-400 mt-0.5">
            Department of Computer Science and Engineering, PES University, Bengaluru
          </p>
        </div>
        <div className="text-right text-slate-400">
          <div>
            <span className="text-slate-300 font-medium">Student:</span> Adarsh Shivanand Madli (<span className="text-amber-400 font-mono">PES2UG24CS028</span>)
          </div>
          <div>
            <span className="text-slate-300 font-medium">Faculty Guide:</span> Dr. Shilpa S, Assistant Professor
          </div>
        </div>
      </div>
    </footer>
  );
}

