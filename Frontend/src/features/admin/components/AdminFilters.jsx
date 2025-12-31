import { Search, ChevronLeft, ChevronRight } from "lucide-react";

// Reusable pill-based filter component
export function PillFilter({ options, value, onChange }) {
  return (
    <div className="inline-flex items-center p-1 bg-slate-100/80 rounded-full border border-slate-200/50 shadow-inner">
      {options.map((option) => {
        const isActive = value === option.value;
        const Icon = option.icon;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              relative inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full
              text-sm font-medium whitespace-nowrap
              transition-all duration-300 ease-out
              focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
              ${
                isActive
                  ? option.activeClasses
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
              }
            `}
          >
            <Icon
              className={`w-4 h-4 transition-transform duration-300 ${
                isActive ? "scale-110" : ""
              }`}
            />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// Reusable search input component
export function SearchInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Search...",
}) {
  return (
    <form onSubmit={onSubmit} className="flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-400"
        />
      </div>
    </form>
  );
}

// Page header component
export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          {title}
        </h1>
        <p className="text-slate-500 mt-1">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}

// Simple pagination component
export function SimplePagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm px-6 py-4 flex items-center justify-between">
      <p className="text-sm text-slate-500">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          Prev
        </button>
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex items-center gap-1 px-3 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
