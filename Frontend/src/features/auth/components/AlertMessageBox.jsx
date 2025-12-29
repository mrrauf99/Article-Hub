import { X } from "lucide-react";

export default function AlertMessageBox({ message, setAlertMessage }) {
  return (
    <div
      className="flex items-center justify-between gap-2 bg-red-100
     text-red-700 border border-red-300 p-3 rounded-md text-sm my-4"
    >
      <span>{message}</span>

      <button
        onClick={() => setAlertMessage("")}
        className="p-1 text-red-700 hover:text-red-900"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
