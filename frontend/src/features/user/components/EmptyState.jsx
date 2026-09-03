export default function EmptyState({ icon: Icon, title, children, action }) {
  return (
    <div className="flex flex-col items-center px-4 py-16 text-center sm:py-20">
      {Icon && (
        <span className="mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-hairline bg-paper-raised text-ink-muted">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      )}
      <h2 className="text-lg font-semibold text-ink">{title}</h2>
      {children && (
        <p className="mt-2 max-w-md text-[0.9375rem] leading-relaxed text-ink-muted">
          {children}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
