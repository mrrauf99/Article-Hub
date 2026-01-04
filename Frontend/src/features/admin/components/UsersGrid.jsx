import {
  Shield,
  FileText,
  Calendar,
  Crown,
  Trash2,
  UserCircle,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
        >
          {/* Card Header with Avatar */}
          <div className="relative p-6 pb-4">
            {/* Role Badge */}
            <span
              className={`absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                user.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              {user.role === "admin" && <Shield className="w-3 h-3" />}
              {user.role}
            </span>

            <div className="flex items-center gap-4">
              <img
                src={
                  user.avatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    user.name
                  )}&background=6366f1&color=fff&size=80`
                }
                alt={user.name}
                className="w-16 h-16 rounded-full object-cover ring-4 ring-slate-100"
              />
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 truncate">
                  {user.name}
                </h3>
                <p className="text-sm text-slate-500 truncate">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="px-6 py-3 bg-slate-50 border-y border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <FileText className="w-4 h-4" />
              <span>{user.article_count} articles</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(user.joined_at)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="p-4 flex items-center gap-2">
            <button
              onClick={() => onChangeRole(user)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              <Crown className="w-4 h-4" />
              Change Role
            </button>
            <button
              onClick={() => onDelete(user)}
              className="inline-flex items-center justify-center w-10 h-10 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
