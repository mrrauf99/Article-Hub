import { Bell } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

export default function NotificationBell({ count = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate("/admin/articles?status=pending");
  };

  // Check if we're on the pending articles page
  const isActive =
    location.pathname === "/admin/articles" &&
    location.search.includes("status=pending");

  return (
    <button
      onClick={handleClick}
      className={`relative p-2 transition-all duration-200 focus:outline-none rounded-lg active:scale-95 ${
        isActive
          ? "text-white/80 hover:text-white"
          : count > 0
            ? "text-orange-400 hover:text-orange-300"
            : "text-white/80 hover:text-white"
      }`}
      aria-label={`${count} pending article${count !== 1 ? "s" : ""}`}
      title={`${count} pending article${count !== 1 ? "s" : ""} for review`}
    >
      <Bell className="w-5 h-5" />

      {/* Badge - only show if count > 0 */}
      {count > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-bold text-white bg-red-600 rounded-full shadow-lg animate-pulse">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
