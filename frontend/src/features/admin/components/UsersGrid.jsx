import { Link } from "react-router-dom";
import {
  Shield,
  FileText,
  Calendar,
  Crown,
  Trash2,
  UserCircle,
  ArrowUpRight,
} from "lucide-react";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UsersGrid({ users, onChangeRole, onDelete }) {
  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center">
        <UserCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500 text-lg">No users found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Card Header with Avatar */}
          <div className="relative p-4 sm:p-6 pb-3 sm:pb-4">
            {/* Role Badge */}
            <span
              className={`absolute top-3 right-3 sm:top-4 sm:right-4 inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                user.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {user.role === "admin" && <Shield className="w-3 h-3" />}
              <span className="hidden sm:inline">{user.role}</span>
              <span className="sm:hidden">
                {user.role === "admin" ? "A" : "U"}
              </span>
            </span>

            <div className="flex items-center gap-3 sm:gap-4 pr-16 sm:pr-20">
              <img
                src={
                  user.avatar_url ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name,
                  )}&background=6366f1&color=fff&size=80`
                }
                alt={user.name}
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover ring-2 sm:ring-4 ring-slate-100 shrink-0"
                loading="lazy"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-sm sm:text-base text-slate-900 truncate">
                  {user.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 truncate">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-4 sm:px-6 py-2.5 sm:py-3 bg-slate-50 border-y border-slate-100 flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600">
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="whitespace-nowrap">
                {user.article_count}{" "}
                {user.article_count === 1 ? "article" : "articles"}
              </span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-600">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="whitespace-nowrap">
                {formatDate(user.joined_at)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-3 sm:p-4 flex items-center gap-2">
            <Link
              to={`/admin/users/${user.id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-semibold text-white shadow-sm transition hover:from-indigo-700 hover:to-blue-700"
            >
              <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">View Profile</span>
              <span className="sm:hidden">Profile</span>
            </Link>

            <button
              onClick={() => onChangeRole(user)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-slate-100 px-2.5 sm:px-3 py-2 text-xs sm:text-sm font-medium text-slate-700 transition-colors hover:bg-slate-200 whitespace-nowrap"
            >
              <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Change Role</span>
              <span className="sm:hidden">Role</span>
            </button>

            <button
              onClick={() => onDelete(user)}
              className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 bg-rose-50 text-rose-600 rounded-lg sm:rounded-xl hover:bg-rose-100 transition-colors shrink-0"
              title="Delete user"
              aria-label="Delete user"
            >
              <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
