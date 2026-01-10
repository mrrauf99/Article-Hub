import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({ current, total, onChange }) {
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);

  function handlePageChange(page) {
    // Prevent invalid page changes
    if (page < 1 || page > total || page === current) return;

    onChange(page);
    // Scroll to top of page immediately then smooth
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  return (
    <div className="flex justify-center items-center gap-1.5">
      {/* Prev */}
      <button
        disabled={current === 1}
        onClick={() => current > 1 && handlePageChange(current - 1)}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium
          bg-white text-slate-600 border border-slate-200 shadow-sm
          hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-1"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {/* First page + ellipsis */}
      {start > 1 && (
        <>
          <button
            onClick={() => handlePageChange(1)}
            className="min-w-[42px] h-[42px] rounded-xl text-sm font-semibold
              bg-white text-slate-600 border border-slate-200 shadow-sm
              hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900
              transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-1"
          >
            1
          </button>
          {start > 2 && (
            <span className="px-2 text-slate-400 text-sm">...</span>
          )}
        </>
      )}

      {/* Page numbers */}
      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
        (page) => {
          const isActive = page === current;

          return (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`min-w-[42px] h-[42px] rounded-xl text-sm font-semibold
                transition-all duration-200 ease-out
                focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-1
                ${
                  isActive
                    ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border border-indigo-500 shadow-md shadow-indigo-500/25"
                    : "bg-white text-slate-600 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900"
                }
              `}
            >
              {page}
            </button>
          );
        }
      )}

      {/* Last page + ellipsis */}
      {end < total && (
        <>
          {end < total - 1 && (
            <span className="px-2 text-slate-400 text-sm">...</span>
          )}
          <button
            onClick={() => handlePageChange(total)}
            className="min-w-[42px] h-[42px] rounded-xl text-sm font-semibold
              bg-white text-slate-600 border border-slate-200 shadow-sm
              hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900
              transition-all duration-200 ease-out
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-1"
          >
            {total}
          </button>
        </>
      )}

      {/* Next */}
      <button
        disabled={current === total}
        onClick={() => current < total && handlePageChange(current + 1)}
        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium
          bg-white text-slate-600 border border-slate-200 shadow-sm
          hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:border-slate-200
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-1"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
