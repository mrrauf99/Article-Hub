import { FileText, Eye, Heart } from "lucide-react";

const STAT_ITEMS = [
  {
    key: "articles",
    label: "Articles",
    icon: FileText,
    gradient: "from-blue-50 to-blue-100",
    border: "border-blue-500",
    iconColor: "text-blue-600",
  },
  {
    key: "views",
    label: "Total Views",
    icon: Eye,
    gradient: "from-green-50 to-green-100",
    border: "border-green-500",
    iconColor: "text-green-600",
  },
  {
    key: "likes",
    label: "Likes",
    icon: Heart,
    gradient: "from-pink-50 to-pink-100",
    border: "border-pink-500",
    iconColor: "text-pink-600",
  },
];

export default function ProfileStats({ stats, isAdmin = false }) {
  // Admin doesn't have articles/views stats - they don't write articles
  if (isAdmin) {
    return null;
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-6 border-b border-gray-200">
      {STAT_ITEMS.map(
        ({ key, label, icon: Icon, gradient, border, iconColor }) => (
          <div
            key={key}
            className={`bg-gradient-to-br ${gradient} p-4 rounded-xl border-l-4 ${border}`}
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className={`w-8 h-8 ${iconColor}`} />
            </div>

            <div className="text-3xl font-bold text-gray-900">
              {stats?.[key] ?? 0}
            </div>

            <div className="text-sm text-gray-600 mt-1">{label}</div>
          </div>
        )
      )}
    </div>
  );
}
