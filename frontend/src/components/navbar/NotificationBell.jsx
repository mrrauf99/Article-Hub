import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Tooltip from "@/components/Tooltip";

export default function NotificationBell({ count = 0 }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/admin/articles?status=pending");
  };

  const tooltipText = `${count} pending article${count !== 1 ? "s" : ""} for review`;

  return (
    <Tooltip text={tooltipText} placement="bottom">
      <button
        onClick={handleClick}
        className="relative p-2 rounded-lg transition-all duration-200 focus:outline-none active:scale-95 text-white hover:bg-slate-500/15 hover:text-white"
        aria-label={tooltipText}
      >
        <Bell className="w-5 h-5" />

        {/* Badge - only show if count > 0 */}
        {count > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-white bg-red-600 rounded-full shadow-lg">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>
    </Tooltip>
  );
}
