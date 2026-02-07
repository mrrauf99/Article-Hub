import {
  FileText,
  Clock,
  CheckCircle,
  TrendingUp,
  Eye,
  XCircle,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";
import StatsGrid from "@/components/StatsGrid";

export default function DashboardStats({ articles = [], stats = {} }) {
  const total = articles.length;
  const approved = articles.filter((a) => a.status === "approved").length;
  const pending = articles.filter((a) => a.status === "pending").length;
  const rejected = articles.filter((a) => a.status === "rejected").length;
  const views = stats.views || 0;

  const statItems = [
    {
      label: "Total Articles",
      value: total,
      Icon: FileText,
      gradient: "from-sky-500 to-blue-600",
      bgGradient: "from-sky-50 to-blue-50",
      iconBg: "bg-sky-100",
      iconColor: "text-sky-600",
    },
    {
      label: "Total Views",
      value: views.toLocaleString(),
      Icon: Eye,
      gradient: "from-violet-500 to-purple-600",
      bgGradient: "from-violet-50 to-purple-50",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
    {
      label: "Approved",
      value: approved,
      Icon: CheckCircle,
      gradient: "from-emerald-500 to-teal-600",
      bgGradient: "from-emerald-50 to-teal-50",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      label: "Pending Review",
      value: pending,
      Icon: Clock,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
    },
    {
      label: "Rejected",
      value: rejected,
      Icon: XCircle,
      gradient: "from-rose-500 to-red-600",
      bgGradient: "from-rose-50 to-red-50",
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <section className="mb-10">
      {/* Section Header */}
      <ScrollReveal animation="fade-up" duration={500}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-lg shadow-sky-500/25">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Your Dashboard</h2>
            <p className="text-sm text-slate-500">
              Overview of your content performance
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Stats Grid */}
      <StatsGrid
        items={statItems}
        gridClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5"
        renderItem={(stat) => <StatCard {...stat} />}
      />
    </section>
  );
}

function StatCard({
  label,
  value,
  Icon,
  gradient,
  bgGradient,
  iconBg,
  iconColor,
}) {
  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${bgGradient} rounded-2xl p-6 border border-white/50 shadow-sm hover:shadow-lg transition-all duration-300 group`}
    >
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600 mb-1">{label}</p>
          <p
            className={`text-4xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
          >
            {value}
          </p>
        </div>

        <div className={`${iconBg} p-3 rounded-xl shadow-sm`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-60`}
      />
    </div>
  );
}
