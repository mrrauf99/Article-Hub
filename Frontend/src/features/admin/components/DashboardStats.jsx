import { Link } from "react-router-dom";
import { Users, FileText, Eye, Clock } from "lucide-react";
import { ScrollReveal, StaggerReveal } from "@/components/ScrollReveal";

const STAT_CARDS = [
  {
    key: "users",
    label: "Total Users",
    getValue: (stats) =>
      parseInt(stats.total_users) + parseInt(stats.total_admins),
    icon: Users,
    gradient: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/25",
  },
  {
    key: "articles",
    label: "Total Articles",
    getValue: (stats) => stats.total_articles,
    icon: FileText,
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/25",
  },
  {
    key: "views",
    label: "Total Views",
    getValue: (stats) => stats.total_views,
    icon: Eye,
    gradient: "from-cyan-500 to-teal-600",
    shadow: "shadow-cyan-500/25",
  },
  {
    key: "pending",
    label: "Pending Review",
    getValue: (stats) => stats.pending_articles,
    icon: Clock,
    gradient: "from-amber-500 to-orange-600",
    shadow: "shadow-amber-500/25",
  },
];

export default function DashboardStats({ stats }) {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <ScrollReveal animation="fade-up" duration={500}>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-slate-500 mt-1">
              Overview of your platform's performance
            </p>
          </div>
          <Link
            to="/admin/articles?status=pending"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg shadow-amber-500/25"
          >
            <Clock className="w-4 h-4" />
            Review Pending
          </Link>
        </div>
      </ScrollReveal>

      {/* Stats Grid */}
      <StaggerReveal staggerDelay={100} animation="fade-up">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STAT_CARDS.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.key}
                className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${card.gradient} p-5 text-white shadow-xl ${card.shadow}`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <p className="text-white/80 text-sm font-medium">
                      {card.label}
                    </p>
                    <Icon className="w-5 h-5 text-white/70" />
                  </div>
                  <p className="mt-2 text-3xl font-bold">
                    {card.getValue(stats)}
                  </p>
                </div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 rounded-full bg-white/10" />
              </div>
            );
          })}
        </div>
      </StaggerReveal>
    </div>
  );
}
