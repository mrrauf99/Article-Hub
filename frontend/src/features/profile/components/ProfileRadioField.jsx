import { User } from "lucide-react";

export default function ProfileRadioField({
  icon: Icon = User,
  label,
  value,
  name,
  isEditing,
  onChange,
  options = [],
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
        <Icon className="w-4 h-4 text-indigo-600" />
        {label}
      </label>
      {isEditing ? (
        <div className="flex flex-wrap gap-4 px-4 py-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all">
          {options.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={value === option.value}
                onChange={onChange}
                className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm lg:text-base text-gray-700 group-hover:text-indigo-600 transition-colors">
                {option.label}
              </span>
            </label>
          ))}
        </div>
      ) : (
        <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-200 text-sm lg:text-base text-gray-900">
          {value ? options.find((opt) => opt.value === value)?.label || value : "Not set"}
        </div>
      )}
    </div>
  );
}
