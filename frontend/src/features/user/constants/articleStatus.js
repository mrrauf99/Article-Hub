import { CheckCircle2, Clock, XCircle } from "lucide-react";

// Writer-facing names for the moderation states. URL params and API values stay
// as the backend spells them (approved / pending / rejected).
export const ARTICLE_STATUS = {
  approved: {
    label: "Published",
    Icon: CheckCircle2,
    pill: "bg-moss-50 text-moss-800 ring-moss-200",
  },
  pending: {
    label: "In review",
    Icon: Clock,
    pill: "bg-review-amber-bg text-review-amber-text ring-review-amber-ring",
  },
  rejected: {
    label: "Rejected",
    Icon: XCircle,
    pill: "bg-rejected-red-bg text-rejected-red-text ring-rejected-red-ring",
  },
};

export const STATUS_TABS = [
  { value: "all", label: "All" },
  { value: "pending", label: "In review" },
  { value: "approved", label: "Published" },
  { value: "rejected", label: "Rejected" },
];
