import { useMemo, useCallback, useTransition, memo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Industry Standard Pagination Range Generator
 * Used in Shadcn UI, Ant Design, and Material-UI
 */
function getPaginationRange(currentPage, totalPages, siblingCount = 1) {
  const totalPageNumbers = siblingCount + 5;

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 1;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, "...", lastPageIndex];
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1,
    );
    return [firstPageIndex, "...", ...rightRange];
  }

  if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    );
    return [firstPageIndex, "...", ...middleRange, "...", lastPageIndex];
  }

  return [];
}

// Pre-computed class strings — defined once outside the component,
// never reconstructed during re-renders.
const BASE_BTN =
  "min-w-[42px] h-[42px] rounded-xl text-sm font-semibold transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-1";
const INACTIVE_BTN =
  "bg-white text-slate-600 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900";
const ACTIVE_BTN =
  "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border border-indigo-500 shadow-md shadow-indigo-500/25";
const NAV_BTN =
  "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed";

// Combine once — eliminates string concatenation on every render
const NAV_BTN_FULL = `${NAV_BTN} ${INACTIVE_BTN}`;
const INACTIVE_PAGE_BTN = `${BASE_BTN} ${INACTIVE_BTN}`;
const ACTIVE_PAGE_BTN = `${BASE_BTN} ${ACTIVE_BTN}`;
const ELLIPSIS_CLASSES =
  "px-2 text-slate-400 text-sm font-medium select-none";

function Pagination({ current, total, onChange, siblingCount = 1 }) {
  const currentPage = Number(current) || 1;
  const totalPages = Number(total) || 1;

  // useTransition: marks page changes as non-urgent so React can keep
  // the UI responsive while the new page content loads.
  const [isPending, startTransition] = useTransition();

  const paginationRange = useMemo(
    () => getPaginationRange(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount],
  );

  const handlePageChange = useCallback(
    (page) => {
      if (
        typeof page !== "number" ||
        page < 1 ||
        page > totalPages ||
        page === currentPage
      ) {
        return;
      }
      // Wrap in startTransition so page navigation doesn't block the UI
      startTransition(() => {
        onChange(page);
      });
    },
    [currentPage, totalPages, onChange, startTransition],
  );

  if (totalPages <= 1) return null;

  return (
    <nav
      className={`flex justify-center items-center gap-1.5 transition-opacity duration-200 ${
        isPending ? "opacity-60 pointer-events-none" : "opacity-100"
      }`}
      aria-label="Pagination Navigation"
      aria-busy={isPending}
    >
      <button
        disabled={currentPage === 1 || isPending}
        onClick={() => handlePageChange(currentPage - 1)}
        className={NAV_BTN_FULL}
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      {paginationRange.map((page, index) => {
        if (page === "...") {
          return (
            <span key={`ellipsis-${index}`} className={ELLIPSIS_CLASSES}>
              &#8230;
            </span>
          );
        }

        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={isActive ? ACTIVE_PAGE_BTN : INACTIVE_PAGE_BTN}
            aria-current={isActive ? "page" : undefined}
          >
            {page}
          </button>
        );
      })}

      <button
        disabled={currentPage === totalPages || isPending}
        onClick={() => handlePageChange(currentPage + 1)}
        className={NAV_BTN_FULL}
        aria-label="Next Page"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </nav>
  );
}

export default memo(Pagination);
