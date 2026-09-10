import { createPortal } from "react-dom";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { AlertCircle, AlertTriangle, Check, Info, Trash2, X } from "lucide-react";

const VARIANT_ICON = { danger: Trash2, warning: AlertTriangle, info: Info, success: Check };
import useModalFocusTrap from "@/hooks/useModalFocusTrap";

export default function ConfirmDialog({
  isOpen,
  title = "Confirm",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // "danger" | "warning" | "info" | "success"
  icon,
  isLoading = false,
  loadingText = "Working on it",
  showLoadingDots = true,
  error = null,
  reasonLabel,
  reasonPlaceholder,
  reasonValue,
  reasonHelper,
  reasonRequired = false,
  onReasonChange,
  confirmMatchText,
  confirmMatchLabel = "Type the title to confirm",
  confirmMatchHelper = "Enter the title exactly as shown above.",
  onConfirm,
  onCancel,
}) {
  const modalRef = useRef(null);
  const dialogRef = useRef(null);
  const titleId = useId();
  const messageId = useId();
  const matchId = useId();
  const reasonId = useId();
  const confirmRef = useRef(null);
  const [matchValue, setMatchValue] = useState("");

  useLayoutEffect(() => {
    if (isOpen) setMatchValue("");
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const scrollY = window.scrollY;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPosition = window.getComputedStyle(document.body).position;
    const originalTop = window.getComputedStyle(document.body).top;
    const originalWidth = window.getComputedStyle(document.body).width;

    // Only apply scroll lock if not already locked
    if (originalStyle !== "hidden") {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    }

    const handleTouchMove = (e) => {
      if (modalRef.current && modalRef.current.contains(e.target)) {
        return;
      }
      e.preventDefault();
    };

    const handleEscape = (e) => {
      if (e.key === "Escape" && !isLoading) {
        onCancel();
      }
    };

    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("keydown", handleEscape);
      // Only restore if we were the ones who locked it
      if (originalStyle !== "hidden") {
        document.body.style.overflow = originalStyle;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        window.scrollTo(0, scrollY);
      }
    };
  }, [isOpen, isLoading, onCancel]);

  useModalFocusTrap(dialogRef, isOpen);

  // The confirm button was disabled while the request ran, which drops focus;
  // put it back on the retry.
  useEffect(() => {
    if (isOpen && error && !isLoading) confirmRef.current?.focus();
  }, [isOpen, error, isLoading]);

  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      icon: "bg-red-50 text-red-700",
      button: "bg-danger hover:bg-danger-deep focus-visible:ring-red-600",
    },
    warning: {
      icon: "bg-amber-50 text-amber-700",
      button: "bg-ink hover:bg-moss-700 focus-visible:ring-moss-600",
    },
    info: {
      icon: "bg-moss-50 text-moss-700",
      button: "bg-ink hover:bg-moss-700 focus-visible:ring-moss-600",
    },
    success: {
      icon: "bg-moss-50 text-moss-700",
      button: "bg-moss-700 hover:bg-moss-800 focus-visible:ring-moss-600",
    },
  };

  const styles = variantStyles[variant] || variantStyles.danger;
  const Icon = icon || VARIANT_ICON[variant] || AlertTriangle;
  const showReasonField = typeof onReasonChange === "function";
  const isReasonMissing =
    reasonRequired && (!reasonValue || !reasonValue.trim());
  const showMatchField = Boolean(confirmMatchText);
  const isMatchInvalid = showMatchField && matchValue.trim() !== confirmMatchText.trim();

  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-ink-950/50"/>

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        className="relative flex max-h-[90vh] w-full max-w-md flex-col rounded-xl bg-paper-raised font-ui shadow-[0_24px_48px_-12px_rgba(20,20,15,0.35)] animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none"
      >
        <button
          onClick={onCancel}
          disabled={isLoading}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-ink/5 hover:text-ink disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="overflow-y-auto overflow-x-auto max-h-[calc(90vh-1px)]">
          <div className="p-6">
            <div
              className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${styles.icon}`}
            >
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>

            <h3 id={titleId} className="mb-2 pr-8 text-lg font-semibold text-ink">
              {title}
            </h3>

            <p id={messageId} className="mb-6 text-[0.9375rem] leading-relaxed text-ink-muted">
              {message}
            </p>

            {showMatchField && (
              <div className="mb-6">
                <label htmlFor={matchId} className="mb-2 block text-left text-sm font-medium text-ink">
                  {confirmMatchLabel}
                </label>
                <input
                  id={matchId}
                  type="text"
                  value={matchValue}
                  onChange={(e) => setMatchValue(e.target.value)}
                  data-autofocus
                  autoComplete="off"
                  spellCheck="false"
                  aria-required="true"
                  aria-describedby={confirmMatchHelper ? `${matchId}-hint` : undefined}
                  className="w-full rounded-lg border border-hairline-strong bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-moss-600 focus:outline-none focus:ring-2 focus:ring-moss-600/15"
                />
                {confirmMatchHelper && (
                  <p id={`${matchId}-hint`} className="mt-2 text-sm text-ink-muted">
                    {confirmMatchHelper}
                  </p>
                )}
              </div>
            )}

            {showReasonField && (
              <div className="mb-6">
                <label htmlFor={reasonId} className="mb-2 block text-left text-sm font-medium text-ink">
                  {reasonLabel || "Reason"}
                  {reasonRequired && (
                    <>
                      <span aria-hidden="true"> *</span>
                      <span className="sr-only"> (required)</span>
                    </>
                  )}
                </label>
                <textarea
                  id={reasonId}
                  rows={4}
                  value={reasonValue || ""}
                  onChange={(e) => onReasonChange(e.target.value)}
                  placeholder={reasonPlaceholder || "Add a reason..."}
                  {...(showMatchField ? {} : { "data-autofocus": true })}
                  aria-required={reasonRequired || undefined}
                  aria-describedby={reasonHelper ? `${reasonId}-hint` : undefined}
                  className="w-full resize-y rounded-lg border border-hairline-strong bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-moss-600 focus:outline-none focus:ring-2 focus:ring-moss-600/15"
                  required={reasonRequired}
                />
                {reasonHelper && (
                  <p id={`${reasonId}-hint`} className="mt-2 text-xs text-ink-muted">
                    {reasonHelper}
                  </p>
                )}
              </div>
            )}

            <div role="alert">
              {error && !isLoading && (
                <div className="mb-5 flex items-start gap-2.5 rounded-lg bg-rejected-red-bg px-3 py-2.5 text-sm leading-relaxed text-rejected-red-text">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <p>
                    <span className="font-semibold">That didn't go through.</span> {error}
                  </p>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                {...(showMatchField || showReasonField ? {} : { "data-autofocus": true })}
                className="inline-flex h-10 items-center justify-center rounded-full border border-hairline-strong px-5 text-sm font-semibold text-ink transition-colors hover:border-ink-faint disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 focus-visible:ring-offset-2"
              >
                {cancelText}
              </button>
              <button
                ref={confirmRef}
                type="button"
                onClick={onConfirm}
                disabled={isLoading || isReasonMissing || isMatchInvalid}
                className={`inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 ${styles.button}`}
              >
                {isLoading ? (
                  showLoadingDots ? (
                    <span className="inline-flex items-center justify-center gap-2">
                      <span className="inline-flex gap-1 items-center translate-y-px">
                        <span className="h-1.5 w-1.5 rounded-full bg-white motion-safe:animate-pulse [animation-delay:-0.3s]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white motion-safe:animate-pulse [animation-delay:-0.15s]" />
                        <span className="h-1.5 w-1.5 rounded-full bg-white motion-safe:animate-pulse" />
                      </span>
                      <span>{loadingText}</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        style={{ marginTop: "-1px" }}
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      <span>{loadingText}</span>
                    </span>
                  )
                ) : error ? (
                  "Try again"
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
}
