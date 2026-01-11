import Tooltip from "@/components/Tooltip";

export default function ActionButton({
  icon: Icon,
  tooltip,
  onClick,
  disabled = false,
  variant = "slate"
}) {
  const variantClasses = {
    emerald: "bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
    rose: "bg-rose-50 text-rose-700 hover:bg-rose-100",
    slate: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  };

  const baseClasses = "inline-flex items-center justify-center w-8 h-8 rounded-lg hover:shadow-sm transition-all";
  const variantClass = variantClasses[variant];

  return (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${variantClass} ${disabled ? "disabled:opacity-50 disabled:cursor-not-allowed" : ""}`}
      >
        <Icon className="w-4 h-4" />
      </button>
    </Tooltip>
  );
}
