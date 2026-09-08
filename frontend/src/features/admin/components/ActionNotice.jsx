import { useEffect, useRef } from "react";
import { CheckCircle2, X } from "lucide-react";

import { ICON_BTN } from "@/styles/panelClasses";

const AUTO_DISMISS_MS = 8000;

// Takes focus by default because the triggering control is usually removed.
export default function ActionNotice({ notice, onDismiss, focusOnShow = true }) {
  const regionRef = useRef(null);

  useEffect(() => {
    if (notice && focusOnShow) regionRef.current?.focus();
  }, [notice, focusOnShow]);

  useEffect(() => {
    if (!notice) return;
    const id = setTimeout(() => {
      // Don't dismiss while the user is focused inside the notice.
      if (!regionRef.current?.contains(document.activeElement)) onDismiss();
    }, AUTO_DISMISS_MS);
    return () => clearTimeout(id);
  }, [notice, onDismiss]);

  const dismiss = () => {
    regionRef.current?.focus();
    onDismiss();
  };

  return (
    <div
      ref={regionRef}
      role="status"
      aria-live="polite"
      tabIndex={-1}
      className="focus:outline-none [&:focus-visible>div]:ring-2 [&:focus-visible>div]:ring-moss-600/50"
    >
      {notice && (
        <div
          key={notice.id}
          className="mb-6 flex items-start gap-3 rounded-xl border border-moss-200 bg-moss-50 py-2 pl-4 pr-2 text-sm text-moss-900 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-1 motion-safe:duration-200"
        >
          <CheckCircle2 className="mt-2 h-4 w-4 shrink-0 text-moss-700" aria-hidden="true" />
          <p className="flex-1 py-1.5 leading-relaxed">{notice.text}</p>
          <button
            type="button"
            onClick={dismiss}
            className={`${ICON_BTN} h-8 w-8 text-moss-800 hover:bg-moss-100`}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
