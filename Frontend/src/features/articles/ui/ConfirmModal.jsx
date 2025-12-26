import { useEffect, useImperativeHandle, useState, forwardRef } from "react";
import { createPortal } from "react-dom";

const ConfirmModal = forwardRef(({ title, description, onConfirm }, ref) => {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onConfirm]);

  if (!open) return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
    >
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-xl shadow-2xl p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>

        <p className="text-sm text-gray-600 mb-6">{description}</p>

        <div className="flex gap-3">
          <button
            onClick={() => setOpen(false)}
            className="flex-1 py-2 rounded-lg text-sm font-medium
                         bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
            className="flex-1 py-2 rounded-lg text-sm font-medium text-white
                         bg-red-600 hover:bg-red-700"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
});

export default ConfirmModal;
