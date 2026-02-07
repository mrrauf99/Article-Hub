export default function ArticlesEmptyState({
  icon,
  title = "No articles found",
  subtitle,
  hint,
  containerClassName = "py-16 sm:py-24 text-center",
  iconWrapperClassName = "inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-4 sm:mb-5",
  titleClassName = "text-slate-500 text-base sm:text-lg font-medium",
  subtitleClassName = "text-slate-400 text-xs sm:text-sm mt-1",
  hintClassName = "text-slate-400 text-xs sm:text-sm mt-1",
}) {
  return (
    <div className={containerClassName}>
      {icon && <div className={iconWrapperClassName}>{icon}</div>}
      <p className={titleClassName}>{title}</p>
      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
      {hint && <p className={hintClassName}>{hint}</p>}
    </div>
  );
}
