import { BookOpen } from "lucide-react";

function PageLoader() {
  return (
    <div
      role="status"
      className="flex w-full min-h-[60vh] flex-col items-center justify-center gap-5 bg-paper p-4 font-ui"
    >
      <div className="relative flex h-24 w-24 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-ink/[0.08]" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-moss-600 motion-safe:animate-spin" />
        <BookOpen className="h-9 w-9 text-ink-muted" strokeWidth={1.5} aria-hidden="true" />
      </div>

      <span className="text-sm font-medium text-ink-muted">Loading...</span>
    </div>
  );
}

export default PageLoader;
