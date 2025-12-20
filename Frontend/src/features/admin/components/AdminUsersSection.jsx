import { Trash2, Shield, User } from "lucide-react";

export default function AdminUsersSection({ users, onDeleteUser }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200">
      <header className="flex items-center justify-between px-4 py-3 border-b">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Manage Users
          </h2>
          <p className="text-xs text-gray-500">
            View all users and remove accounts if needed.
          </p>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Role</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b last:border-0">
                <td className="px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-2 text-xs text-gray-700">
                  {user.email}
                </td>
                <td className="px-4 py-2 text-xs">
                  <span
                    className={`
                      inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium
                      ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-slate-100 text-slate-700"
                      }
                    `}
                  >
                    {user.role === "admin" && (
                      <Shield className="w-3 h-3" />
                    )}
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => onDeleteUser(user.id)}
                      className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-6 text-center text-xs text-gray-500"
                >
                  No users in the system.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}