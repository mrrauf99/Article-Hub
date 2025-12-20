import { useEffect, useImperativeHandle, useState } from "react";
import { createPortal } from "react-dom";

export default function ConfirmModal({ title, description, onConfirm, ref }) {
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
  }));

  // keyboard + scroll lock
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setOpen(false);
      }
      if (e.key === "Enter") {
        onConfirm();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onConfirm]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-6">{description}</p>

        <div className="flex gap-3">
          <button
            onClick={() => setOpen(false)}
            className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
          >
            No
          </button>

          <button
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
            className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
