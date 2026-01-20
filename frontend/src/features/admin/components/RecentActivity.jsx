import { Link } from "react-router-dom";
import {
  FileText,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  Shield,
  ArrowRight,
} from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

const ARTICLE_STATS = [
  {
    key: "approved",
    label: "Approved",
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    key: "rejected",
    label: "Rejected",
    icon: XCircle,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

function StatusBadge({ status }) {
  const config = {
    approved: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      Icon: CheckCircle2,
    },
    pending: { bg: "bg-amber-50", text: "text-amber-700", Icon: Clock },
    rejected: { bg: "bg-rose-50", text: "text-rose-700", Icon: XCircle },
  };
  const { bg, text, Icon } = config[status] || config.pending;

  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${bg} ${text}`}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
}

function RoleBadge({ role }) {
  const isAdmin = role === "admin";
  return (
    <span
      className={`shrink-0 inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
        isAdmin ? "bg-purple-50 text-purple-700" : "bg-slate-100 text-slate-700"
      }`}
    >
      {isAdmin && <Shield className="w-3 h-3" />}
      {role}
    </span>
  );
}

export default function RecentActivity({ stats, recentArticles, recentUsers }) {
  return (
    <div className="space-y-6">
      {/* Article Status Breakdown */}
      <ScrollReveal animation="fade-up" duration={500}>
        <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-slate-900">
                Article Status Overview
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Distribution of articles by status
              </p>
            </div>
            <Link
              to="/admin/articles"
              className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 self-start sm:self-auto"
            >
              View All
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {ARTICLE_STATS.map((stat) => {
              const Icon = stat.icon;
              const value = stats[`${stat.key}_articles`];
              return (
                <div
                  key={stat.key}
                  className={`${stat.bg} rounded-lg sm:rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4`}
                >
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xl sm:text-2xl font-bold text-slate-900">
                      {value}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600">
                      {stat.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>

      {/* Recent Activity Grid */}
      <ScrollReveal animation="fade-up" duration={500} delay={100}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Recent Articles */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                    Recent Articles
                  </h3>
                  <p className="text-xs text-slate-500">Latest submissions</p>
                </div>
              </div>
              <Link
                to="/admin/articles"
                className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 self-start sm:self-auto"
              >
                View All →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentArticles.length === 0 ? (
                <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-xs sm:text-sm text-slate-500">
                  No articles yet
                </div>
              ) : (
                recentArticles.map((article) => (
                  <div
                    key={article.article_id}
                    className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-2 sm:gap-3">
                      <img
                        src={
                          article.author_avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            article.author_name,
                          )}&background=6366f1&color=fff`
                        }
                        alt={article.author_name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-slate-900 truncate">
                          {article.title}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 truncate">
                          by {article.author_name}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <StatusBadge status={article.status} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-semibold text-slate-900">
                    Recent Users
                  </h3>
                  <p className="text-xs text-slate-500">Newest registrations</p>
                </div>
              </div>
              <Link
                to="/admin/users"
                className="text-xs sm:text-sm font-medium text-indigo-600 hover:text-indigo-700 self-start sm:self-auto"
              >
                View All →
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {recentUsers.length === 0 ? (
                <div className="px-4 sm:px-6 py-6 sm:py-8 text-center text-xs sm:text-sm text-slate-500">
                  No users yet
                </div>
              ) : (
                recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="px-4 sm:px-6 py-3 sm:py-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <img
                        src={
                          user.avatar_url ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name,
                          )}&background=6366f1&color=fff`
                        }
                        alt={user.name}
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shrink-0"
                        loading="lazy"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium text-slate-900 truncate">
                          {user.name}
                        </p>
                        <p className="text-xs sm:text-sm text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="shrink-0">
                        <RoleBadge role={user.role} />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
