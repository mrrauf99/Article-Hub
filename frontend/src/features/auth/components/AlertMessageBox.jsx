import { X, AlertCircle } from "lucide-react";

export default function AlertMessageBox({ message, setAlertMessage }) {
  return (
    <div
      className="flex items-start gap-3 bg-red-50
     text-red-700 border border-red-200 p-4 rounded-xl text-sm mb-6"
    >
      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <span className="flex-1">{message}</span>

      <button
        onClick={() => setAlertMessage("")}
        className="p-1 text-red-500 hover:text-red-700 transition-colors flex-shrink-0"
        aria-label="Close alert"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
