export default function SectionHeader({
  title,
  subtitle,
  meta,
  actions,
  icon: Icon,
  titleAs: TitleTag = "h2",
  containerClassName = "",
  titleClassName = "text-lg sm:text-xl font-bold text-slate-900",
  subtitleClassName = "text-xs sm:text-sm text-slate-500",
  metaClassName = "text-sm text-slate-500",
  actionsClassName = "",
}) {
  return (
    <div
      className={`flex flex-wrap items-center justify-between gap-4 ${containerClassName}`}
    >
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25">
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        <div>
          <TitleTag className={titleClassName}>{title}</TitleTag>
          {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
          {meta && <div className={metaClassName}>{meta}</div>}
        </div>
      </div>

      {actions && (
        <div className={`flex items-center gap-3 ${actionsClassName}`}>
          {actions}
        </div>
      )}
    </div>
  );
}
