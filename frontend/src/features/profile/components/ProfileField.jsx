export default function ProfileField({
  icon: Icon,
  label,
  value,
  name,
  isEditing,
  onChange,
  disabled = false,
  type = "text",
  rows,
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Icon className="w-4 h-4 text-indigo-600" />
        {label}
      </label>
      {isEditing && !disabled ? (
        rows ? (
          <textarea
            name={name}
            value={value || ""}
            onChange={onChange}
            rows={rows}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-sm lg:text-base"
            placeholder={`Enter your ${label.toLowerCase()}...`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm lg:text-base"
          />
        )
      ) : (
        <div
          className={`px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-sm lg:text-base ${
            disabled ? "text-gray-500" : "text-gray-900"
          }`}
        >
          {value || "Not set"}
          {disabled && (
            <span className="text-xs ml-2 text-gray-400 italic">
              (Read-only)
            </span>
          )}
        </div>
      )}
    </div>
  );
}
