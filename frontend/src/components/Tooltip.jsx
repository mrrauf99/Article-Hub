export default function Tooltip({
  children,
  text,
  placement = "top",
  delay = 0,
  disabled = false,
}) {
  if (disabled) return children;

  const isTop = placement === "top";

  const containerClasses = isTop
    ? "absolute bottom-full left-1/2 -translate-x-1/2 mb-2"
    : "absolute top-full left-1/2 -translate-x-1/2 mt-2";

  const arrowClasses = isTop
    ? "absolute top-full left-1/2 -translate-x-1/2 border-4 border-t-slate-800 border-l-transparent border-r-transparent border-b-transparent"
    : "absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-b-slate-800 border-l-transparent border-r-transparent border-t-transparent";

  const transitionClasses =
    delay > 0
      ? `opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out`
      : `opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-in-out group-hover:delay-[${delay}ms]`;

  return (
    <div className="relative group">
      {children}
      <div
        className={`${containerClasses} px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg whitespace-nowrap ${transitionClasses} z-50 pointer-events-none shadow-lg`}
      >
        {text}
        <div className={arrowClasses} />
      </div>
    </div>
  );
}
