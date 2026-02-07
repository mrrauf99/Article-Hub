import { User } from "lucide-react";
import {
  FIELD_GROUP,
  FIELD_LABEL,
  FIELD_READONLY,
} from "../styles/profileClasses";

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
    <div className={FIELD_GROUP}>
      <label className={FIELD_LABEL}>
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
        <div className={`${FIELD_READONLY} text-gray-900`}>
          {value
            ? options.find((opt) => opt.value === value)?.label || value
            : "Not set"}
        </div>
      )}
    </div>
  );
}
