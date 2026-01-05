import { createPortal } from "react-dom";
import { User, Shield, X } from "lucide-react";

const ROLES = [
  {
    value: "user",
    label: "User",
    description: "Standard user with article creation access",
    icon: User,
    color: "blue",
  },
  {
    value: "admin",
    label: "Admin",
    description: "Full access to manage users and articles",
    icon: Shield,
    color: "purple",
  },
];

export default function RoleChangeModal({
  user,
  isLoading,
  onChangeRole,
  onClose,
}) {
  if (!user) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all z-10"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <img
              src={
                user.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  user.name
                )}&background=6366f1&color=fff`
              }
              alt={user.name}
              className="w-14 h-14 rounded-full object-cover ring-4 ring-slate-100"
            />
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Change User Role
              </h3>
              <p className="text-slate-500">{user.name}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-sm text-slate-600 mb-4">
            Select a new role for this user:
          </p>

          {ROLES.map((role) => {
            const Icon = role.icon;
            const isCurrentRole = user.role === role.value;
            const colorClasses =
              role.color === "blue"
                ? {
                    active:
                      "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50",
                    hover: "hover:border-blue-300 hover:bg-blue-50/50",
                    icon: "bg-gradient-to-br from-blue-500 to-indigo-500",
                    iconText: "text-white",
                    badge: "text-blue-700 bg-blue-100",
                  }
                : {
                    active:
                      "border-purple-500 bg-gradient-to-r from-purple-50 to-pink-50",
                    hover: "hover:border-purple-300 hover:bg-purple-50/50",
                    icon: "bg-gradient-to-br from-purple-500 to-pink-500",
                    iconText: "text-white",
                    badge: "text-purple-700 bg-purple-100",
                  };

            return (
              <button
                key={role.value}
                onClick={() => onChangeRole(user.id, role.value)}
                disabled={isCurrentRole || isLoading}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                  isCurrentRole
                    ? colorClasses.active
                    : `border-slate-200 ${colorClasses.hover}`
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl ${colorClasses.icon} flex items-center justify-center shadow-lg`}
                >
                  <Icon className={`w-5 h-5 ${colorClasses.iconText}`} />
                </div>
                <div className="text-left flex-1">
                  <p className="font-semibold text-slate-900">{role.label}</p>
                  <p className="text-sm text-slate-500">{role.description}</p>
                </div>
                {isCurrentRole && (
                  <span
                    className={`text-xs font-semibold ${colorClasses.badge} px-2.5 py-1 rounded-full`}
                  >
                    Current
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-slate-100 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
}
