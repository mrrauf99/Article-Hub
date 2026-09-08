import { createPortal } from "react-dom";
import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

import useModalFocusTrap from "@/hooks/useModalFocusTrap";

export default function AdminDialog({
  title,
  description,
  onClose,
  busy = false,
  size = "md",
  footer,
  children,
}) {
  const dialogRef = useRef(null);
  const titleId = useId();
  const descId = useId();

  useModalFocusTrap(dialogRef, true);

  useEffect(() => {
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    const onKey = (e) => {
      if (e.key === "Escape" && !busy) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [busy, onClose]);

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-ink-950/50 motion-safe:animate-in motion-safe:fade-in motion-safe:duration-150"
        onClick={busy ? undefined : onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        className={`relative flex max-h-[92dvh] w-full flex-col rounded-t-xl bg-paper-raised font-ui shadow-[0_24px_48px_-12px_rgba(20,20,15,0.35)] motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-200 sm:rounded-xl ${
          size === "lg" ? "sm:max-w-2xl" : "sm:max-w-md"
        }`}
      >
        <div className="flex items-start gap-4 border-b border-hairline px-5 py-4 sm:px-6">
          <div className="min-w-0 flex-1">
            {/* Focus the title on open so no focus ring flashes on Close. */}
            <h2
              id={titleId}
              tabIndex={-1}
              data-autofocus
              className="text-base font-semibold text-ink focus:outline-none"
            >
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-0.5 text-sm text-ink-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="-mr-2 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">{children}</div>

        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-hairline px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
}
