import {
  FIELD_GROUP,
  FIELD_LABEL,
  FIELD_INPUT,
  FIELD_READONLY,
} from "../styles/profileClasses";

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
    <div className={FIELD_GROUP}>
      <label className={FIELD_LABEL}>
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
            className={`${FIELD_INPUT} resize-none`}
            placeholder={`Enter your ${label.toLowerCase()}...`}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            className={FIELD_INPUT}
          />
        )
      ) : (
        <div
          className={`${FIELD_READONLY} ${
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
