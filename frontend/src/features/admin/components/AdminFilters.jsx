import { Search } from "lucide-react";

// Reusable pill-based filter component
export function PillFilter({ options, value, onChange }) {
  return (
    <div className="inline-flex items-center p-0.5 sm:p-1 bg-slate-100/80 rounded-full border border-slate-200/50 shadow-inner overflow-x-auto scrollbar-hide">
      <div className="flex items-center gap-0.5 sm:gap-1">
        {options.map((option) => {
          const isActive = value === option.value;
          const Icon = option.icon;
          return (
            <button
              key={option.value}
              onClick={() => onChange(option.value)}
              className={`
                relative inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full
                text-xs sm:text-sm font-medium whitespace-nowrap shrink-0
                transition-all duration-300 ease-out
                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2
                ${
                  isActive
                    ? option.activeClasses
                    : "text-slate-500 hover:text-slate-700 hover:bg-white/60"
                }
              `}
              title={option.label}
            >
              <Icon
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 shrink-0 ${
                  isActive ? "scale-110" : ""
                }`}
              />
              <span className="hidden sm:inline">{option.label}</span>
            </button>
          );
        })}
      </div>
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
