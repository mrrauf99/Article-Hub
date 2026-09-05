import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Tooltip from "@/components/Tooltip";

export default function NotificationBell({ count = 0 }) {
  const navigate = useNavigate();

  const tooltipText = `${count} article${count !== 1 ? "s" : ""} in review`;

  return (
    <Tooltip text={tooltipText} placement="bottom">
      <button
        type="button"
        onClick={() => navigate("/admin/dashboard")}
        className="relative rounded-lg p-2 text-white transition-colors duration-150 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-300"
        aria-label={`Review queue, ${tooltipText}`}
      >
        <Bell className="h-5 w-5" aria-hidden="true" />

        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-moss-300 px-1 text-xs font-semibold tabular-nums text-ink-950">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>
    </Tooltip>
  );
}
