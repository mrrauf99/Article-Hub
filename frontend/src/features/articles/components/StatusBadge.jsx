import { CheckCircle, Clock, XCircle } from "lucide-react";

const styleMap = {
  approved: "bg-green-100 text-green-700 border-green-300",
  pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
  rejected: "bg-red-100 text-red-700 border-red-300",
};

const iconMap = {
  approved: <CheckCircle className="w-4 h-4" />,
  pending: <Clock className="w-4 h-4" />,
  rejected: <XCircle className="w-4 h-4" />,
};

export default function StatusBadge({ status }) {
  const classes =
    styleMap[status] ?? "bg-gray-100 text-gray-700 border-gray-300";
  const icon = iconMap[status] ?? null;

  const label = status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Unknown";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full 
      text-sm font-medium border ${classes}`}
    >
      {icon}
      {label}
    </span>
  );
}
