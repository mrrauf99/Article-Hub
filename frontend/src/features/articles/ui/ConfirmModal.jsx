import {
  useLayoutEffect,
  useImperativeHandle,
  useState,
  forwardRef,
  useRef,
} from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const ConfirmModal = forwardRef(
  (
    {
      title,
      description,
      onConfirm,
      confirmText = "Yes, Delete",
      confirmDisabled = false,
    },
    ref,
  ) => {
    const [open, setOpen] = useState(false);
    const modalRef = useRef(null);

    useImperativeHandle(ref, () => ({
      open: () => setOpen(true),
      close: () => setOpen(false),
    }));

    useLayoutEffect(() => {
      if (!open) return;

      const scrollY = window.scrollY;
      const originalStyle = window.getComputedStyle(document.body).overflow;
      const originalPosition = window.getComputedStyle(document.body).position;
      const originalTop = window.getComputedStyle(document.body).top;
      const originalWidth = window.getComputedStyle(document.body).width;

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      const onKeyDown = (e) => {
        if (e.key === "Escape") setOpen(false);
        if (e.key === "Enter") {
          e.preventDefault();
          onConfirm();
          setOpen(false);
        }
      };

      const handleTouchMove = (e) => {
        if (modalRef.current && modalRef.current.contains(e.target)) {
          return;
        }
        e.preventDefault();
      };

      window.addEventListener("keydown", onKeyDown);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });

      return () => {
        window.removeEventListener("keydown", onKeyDown);
        document.removeEventListener("touchmove", handleTouchMove);
        document.body.style.overflow = originalStyle;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        window.scrollTo(0, scrollY);
      };
    }, [open, onConfirm]);

    if (!open) return null;

    return createPortal(
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      >
        <div className="relative w-full max-w-sm sm:max-w-md max-h-[90vh] flex flex-col bg-white rounded-xl shadow-2xl overflow-hidden">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 z-10 p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="overflow-y-auto overflow-x-auto max-h-[calc(90vh-1px)]">
            <div className="p-5 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 pr-8">
                {title}
              </h3>

              <p className="text-sm text-gray-600 mb-6">{description}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  disabled={confirmDisabled}
                  className="flex-1 py-2 rounded-lg text-sm font-medium
                             bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  onClick={() => {
                    onConfirm();
                    setOpen(false);
                  }}
                  disabled={confirmDisabled}
                  className="flex-1 py-2 rounded-lg text-sm font-medium text-white
                             bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>,
      document.getElementById("modal-root"),
    );
  },
);

export default ConfirmModal;
