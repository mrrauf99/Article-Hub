const TONES = {
  default: { bg: "bg-moss-50", text: "text-moss-700" },
  success: { bg: "bg-emerald-50", text: "text-emerald-600" },
  warning: { bg: "bg-amber-50", text: "text-amber-600" },
  danger: { bg: "bg-rose-50", text: "text-rose-600" },
};

/**
 * Shared stat display. `variant="plain"` renders a bare centered number
 * (no card chrome) for dense stat rows; the default "card" variant renders
 * an icon + value tile for standalone stat grids.
 */
export default function StatCard({
  variant = "card",
  icon: Icon,
  value,
  label,
  description,
  sublabel,
  tone = "default",
}) {
  if (variant === "plain") {
    return (
      <div className="text-center">
        <div className="font-editorial text-3xl lg:text-4xl text-ink mb-1.5">
          {value}
        </div>
        <div className="text-sm font-semibold text-ink">{label}</div>
        {sublabel && (
          <div className="text-xs text-ink-faint mt-0.5">{sublabel}</div>
        )}
      </div>
    );
  }

  const t = TONES[tone] || TONES.default;

  return (
    <div className="h-full rounded-xl border border-hairline bg-paper-raised p-5">
      <div className="flex items-center gap-3 mb-3">
        {Icon && (
          <span
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${t.bg} ${t.text}`}
          >
            <Icon className="w-5 h-5" />
          </span>
        )}
        <div>
          <div className="font-editorial text-2xl text-ink">{value}</div>
          <div className="text-sm font-semibold text-ink-muted">{label}</div>
        </div>
      </div>
      {description && (
        <p className="text-sm text-ink-faint">{description}</p>
      )}
    </div>
  );
}
