export default function SocialLinkField({
  icon: Icon,
  label,
  value,
  name,
  isEditing,
  onChange,
  placeholder,
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Icon className="w-5 h-5 text-gray-600" />
        {label}
      </label>
      {isEditing ? (
        <input
          type="url"
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm lg:text-base"
        />
      ) : (
        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-sm lg:text-base">
          {value ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 hover:underline truncate block"
            >
              {value}
            </a>
          ) : (
            <span className="text-gray-500">Not set</span>
          )}
        </div>
      )}
    </div>
  );
}
