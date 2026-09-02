import { createPortal } from "react-dom";
import { useId, useLayoutEffect, useRef } from "react";
import { AlertTriangle, X, AlertCircle } from "lucide-react";
import useModalFocusTrap from "@/hooks/useModalFocusTrap";

export default function ConfirmDialog({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger", // "danger" | "warning" | "info" | "success"
  isLoading = false,
  loadingText = "Processing",
  showLoadingDots = true,
  error = null,
  reasonLabel,
  reasonPlaceholder,
  reasonValue,
  reasonHelper,
  reasonRequired = false,
  onReasonChange,
  onConfirm,
  onCancel,
}) {
  const modalRef = useRef(null);
  const dialogRef = useRef(null);
  const titleId = useId();
  const messageId = useId();

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
  const showReasonField = typeof onReasonChange === "function";
  const isReasonMissing =
    reasonRequired && (!reasonValue || !reasonValue.trim());

  return createPortal(
    <div
      ref={modalRef}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-ink-950/50"/>

      <div
        ref={dialogRef}
        role={error ? "alertdialog" : "dialog"}
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
            {error ? (
              <>
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-700">
                  <AlertCircle className="h-5 w-5" aria-hidden="true" />
                </div>

                <h3 id={titleId} className="mb-2 pr-8 text-lg font-semibold text-ink">
                  Something went wrong
                </h3>

                <p id={messageId} className="mb-6 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {error}
                </p>

                <div className="flex justify-end">
                  <button
                    onClick={onCancel}
                    data-autofocus
                    className="inline-flex h-10 items-center justify-center rounded-full bg-ink px-6 text-sm font-semibold text-paper transition-colors hover:bg-moss-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 focus-visible:ring-offset-2"
                  >
                    OK
                  </button>
                </div>
              </>
            ) : (
              <>
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-full ${styles.icon}`}
                >
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" />
                </div>

                <h3 id={titleId} className="mb-2 pr-8 text-lg font-semibold text-ink">
                  {title}
                </h3>

                <p id={messageId} className="mb-6 text-[0.9375rem] leading-relaxed text-ink-muted">
                  {message}
                </p>

                {showReasonField && (
                  <div className="mb-6">
                    <label className="mb-2 block text-left text-sm font-medium text-ink">
                      {reasonLabel || "Reason"}
                      {reasonRequired ? " *" : ""}
                    </label>
                    <textarea
                      rows={4}
                      value={reasonValue || ""}
                      onChange={(e) => onReasonChange(e.target.value)}
                      placeholder={reasonPlaceholder || "Add a reason..."}
                      className="w-full resize-y rounded-lg border border-hairline-strong bg-paper-raised px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-moss-600 focus:outline-none focus:ring-2 focus:ring-moss-600/15"
                      required={reasonRequired}
                    />
                    {reasonHelper && (
                      <p className="mt-2 text-xs text-ink-muted">
                        {reasonHelper}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    data-autofocus
                    className="inline-flex h-10 items-center justify-center rounded-full border border-hairline-strong px-5 text-sm font-semibold text-ink transition-colors hover:border-ink-faint disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 focus-visible:ring-offset-2"
                  >
                    {cancelText}
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    disabled={isLoading || isReasonMissing}
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
                    ) : (
                      confirmText
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
}
