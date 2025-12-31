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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Article Status Overview
            </h2>
            <p className="text-sm text-slate-500">
              Distribution of articles by status
            </p>
          </div>
          <Link
            to="/admin/articles"
            className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            View All
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ARTICLE_STATS.map((stat) => {
            const Icon = stat.icon;
            const value = stats[`${stat.key}_articles`];
            return (
              <div
                key={stat.key}
                className={`${stat.bg} rounded-xl p-4 flex items-center gap-4`}
              >
                <div
                  className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}
                >
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-900">{value}</p>
                  <p className="text-sm text-slate-600">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">
                  Recent Articles
                </h3>
                <p className="text-xs text-slate-500">Latest submissions</p>
              </div>
            </div>
            <Link
              to="/admin/articles"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentArticles.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500">
                No articles yet
              </div>
            ) : (
              recentArticles.map((article) => (
                <div
                  key={article.article_id}
                  className="px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={
                        article.author_avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          article.author_name
                        )}&background=6366f1&color=fff`
                      }
                      alt={article.author_name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">
                        {article.title}
                      </p>
                      <p className="text-sm text-slate-500">
                        by {article.author_name}
                      </p>
                    </div>
                    <StatusBadge status={article.status} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Recent Users</h3>
                <p className="text-xs text-slate-500">Newest registrations</p>
              </div>
            </div>
            <Link
              to="/admin/users"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View All
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentUsers.length === 0 ? (
              <div className="px-6 py-8 text-center text-slate-500">
                No users yet
              </div>
            ) : (
              recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        user.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user.name
                        )}&background=6366f1&color=fff`
                      }
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <p className="text-sm text-slate-500 truncate">
                        {user.email}
                      </p>
                    </div>
                    <RoleBadge role={user.role} />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
