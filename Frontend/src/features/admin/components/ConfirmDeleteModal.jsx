import { createPortal } from "react-dom";
import { AlertTriangle, Trash2, X } from "lucide-react";

export default function ConfirmDeleteModal({
  title,
  message,
  warning,
  isLoading,
  onConfirm,
  onCancel,
  confirmText = "Delete",
  loadingText = "Deleting...",
}) {
  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6">
          {/* Icon */}
          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-rose-100 to-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="w-7 h-7 text-rose-600" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 text-center mb-2">
            {title}
          </h3>
          <p className="text-sm text-slate-500 text-center mb-4">
            This action cannot be undone
          </p>

          {/* Message */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
            <p className="text-slate-700 text-center">{message}</p>
          </div>

          {/* Warning */}
          {warning && (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-sm text-amber-800 text-center">{warning}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-xl font-semibold hover:from-rose-600 hover:to-red-600 shadow-lg shadow-rose-500/25 transition-all hover:shadow-rose-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="w-4 h-4" />
              {isLoading ? loadingText : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
