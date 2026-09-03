export default function PageHeader({ title, description, actions, children }) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-editorial text-3xl leading-tight tracking-[-0.01em] text-ink sm:text-[2.25rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-[65ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            {description}
          </p>
        )}
        {children}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-3">{actions}</div>}
    </header>
  );
}
