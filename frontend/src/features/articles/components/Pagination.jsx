import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ current, total, onChange }) {
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);

  function handlePageChange(page) {
    if (page < 1 || page > total || page === current) return;
    onChange(page);
  }

  const baseButtonClasses = "min-w-[42px] h-[42px] rounded-xl text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-1";
  const inactiveButtonClasses = "bg-white text-slate-600 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900";
  const activeButtonClasses = "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border border-indigo-500 shadow-md shadow-indigo-500/25";
  const navButtonClasses = "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200";

  return (
    <div className="flex justify-center items-center gap-1.5">
      <button
        disabled={current === 1}
        onClick={() => handlePageChange(current - 1)}
        className={`${navButtonClasses} ${inactiveButtonClasses}`}
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {start > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className={`${baseButtonClasses} ${inactiveButtonClasses}`}
          >
            1
          </button>
          {start > 2 && <span className="px-2 text-slate-400 text-sm">...</span>}
        </>
      )}

      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map((page) => (
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`${baseButtonClasses} ${page === current ? activeButtonClasses : inactiveButtonClasses}`}
        >
          {page}
        </button>
      ))}

      {end < total && (
        <>
          {end < total - 1 && <span className="px-2 text-slate-400 text-sm">...</span>}
          <button
            onClick={() => handlePageChange(total)}
            className={`${baseButtonClasses} ${inactiveButtonClasses}`}
          >
            {total}
          </button>
        </>
      )}

      <button
        disabled={current === total}
        onClick={() => handlePageChange(current + 1)}
        className={`${navButtonClasses} ${inactiveButtonClasses}`}
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
