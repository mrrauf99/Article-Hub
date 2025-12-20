export default function Pagination({ current, total, onChange }) {
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);

  const baseBtn =
    "px-3 py-2 rounded-lg text-sm font-medium border transition-colors " +
    "focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0";

  return (
    <div className="mt-14 flex justify-center items-center gap-2">
      {/* Prev */}
      <button
        disabled={current === 1}
        onClick={() => onChange(current - 1)}
        className={`${baseBtn}
          bg-white text-slate-700 border-slate-200
          hover:bg-slate-100
          disabled:opacity-40 disabled:cursor-not-allowed
        `}
      >
        Prev
      </button>

      {/* Pages */}
      {Array.from({ length: end - start + 1 }, (_, i) => start + i).map(
        (page) => {
          const isActive = page === current;

          return (
            <button
              key={page}
              onClick={() => onChange(page)}
              className={`${baseBtn} min-w-[40px] font-semibold
                ${
                  isActive
                    ? "bg-sky-600 text-white border-sky-600"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }
              `}
            >
              {page}
            </button>
          );
        }
      )}

      {/* Next */}
      <button
        disabled={current === total}
        onClick={() => onChange(current + 1)}
        className={`${baseBtn}
          bg-white text-slate-700 border-slate-200
          hover:bg-slate-100
          disabled:opacity-40 disabled:cursor-not-allowed
        `}
      >
        Next
      </button>
    </div>
  );
}
