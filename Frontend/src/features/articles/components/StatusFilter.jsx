import { CheckCircle2, Clock, XCircle, LayoutGrid } from "lucide-react";

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All",
    icon: LayoutGrid,
    activeClasses: "bg-slate-900 text-white shadow-lg shadow-slate-900/25",
  },
  {
    value: "approved",
    label: "Approved",
    icon: CheckCircle2,
    activeClasses:
      "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30",
  },
  {
    value: "pending",
    label: "Pending",
    icon: Clock,
    activeClasses:
      "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-500/30",
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: XCircle,
    activeClasses:
      "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30",
  },
];

export default function StatusFilter({ value = "all", onChange }) {
  return (
    <div className="inline-flex items-center p-1 bg-slate-100/80 backdrop-blur-sm rounded-full border border-slate-200/50 shadow-inner">
      {STATUS_OPTIONS.map((option) => {
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
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
