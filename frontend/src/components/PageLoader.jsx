import { BookOpen } from "lucide-react";

function PageLoader() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center gap-6 p-4">
      <div className="relative flex items-center justify-center w-24 h-24">
        {/* Subtle background track */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
        
        {/* Minimalist spinning arc */}
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-500 animate-spin" />

        {/* Clean central icon */}
        <BookOpen className="w-10 h-10 text-slate-700" strokeWidth={1.5} />
      </div>

      <p className="text-base font-medium text-slate-600 tracking-wide animate-pulse">
        Loading...
      </p>
    </div>
  );
}

export default PageLoader;
