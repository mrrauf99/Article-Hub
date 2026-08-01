import { memo } from "react";

function PageLoader() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center py-12 px-4 animate-in fade-in duration-300">
      <div className="relative flex items-center justify-center">
        {/* Outer ambient glow */}
        <div className="absolute w-16 h-16 rounded-full bg-sky-500/20 blur-xl animate-pulse-slow" />
        
        {/* Spinner ring */}
        <div className="w-12 h-12 rounded-full border-3 border-slate-200 border-t-sky-600 animate-spin" />
      </div>

      <p className="mt-4 text-sm font-medium text-slate-600 tracking-wide">
        Loading...
      </p>
    </div>
  );
}

export default memo(PageLoader);
