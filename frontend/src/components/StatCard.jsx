export default function StatCard({
  variant = "about",
  number,
  label,
  sublabel,
  icon: Icon,
  value,
  description,
}) {
  if (variant === "contact") {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-14 h-14 bg-blue-600/10 rounded-lg flex items-center justify-center">
            {Icon && <Icon className="w-7 h-7 text-blue-600" />}
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900">{value}</div>
            <div className="text-sm font-semibold text-slate-700">{label}</div>
          </div>
        </div>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent mb-2">
        {number}
      </div>
      <div className="text-sm font-semibold text-slate-900">{label}</div>
      <div className="text-xs text-slate-500 mt-1">{sublabel}</div>
    </div>
  );
}
