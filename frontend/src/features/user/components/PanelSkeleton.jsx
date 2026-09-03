// Suspense fallback for lazy User Panel pages: the shape of a page header and
// ledger rows, so content lands where the placeholder was.
export default function PanelSkeleton() {
  return (
    <div role="status" aria-label="Loading" className="motion-safe:animate-pulse">
      <div className="h-9 w-56 rounded-md bg-ink/[0.07]" />
      <div className="mt-3 h-4 w-80 max-w-full rounded bg-ink/[0.05]" />

      <div className="mt-10 flex gap-6 border-b border-hairline pb-3">
        {[48, 72, 72, 64].map((w, i) => (
          <div key={i} className="h-4 rounded bg-ink/[0.06]" style={{ width: w }} />
        ))}
      </div>

      <ul className="divide-y divide-hairline">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-center gap-4 py-4">
            <div className="h-12 w-16 shrink-0 rounded-md bg-ink/[0.06]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-2/3 rounded bg-ink/[0.07]" />
              <div className="h-3 w-1/3 rounded bg-ink/[0.05]" />
            </div>
            <div className="hidden h-6 w-24 rounded-full bg-ink/[0.05] sm:block" />
          </li>
        ))}
      </ul>
    </div>
  );
}
