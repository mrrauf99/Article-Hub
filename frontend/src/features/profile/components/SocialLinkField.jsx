import {
  FIELD_GROUP,
  FIELD_LABEL,
  FIELD_INPUT,
  FIELD_READONLY,
} from "../styles/profileClasses";

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
    <div className={FIELD_GROUP}>
      <label className={FIELD_LABEL}>
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
          className={FIELD_INPUT}
        />
      ) : (
        <div className={FIELD_READONLY}>
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
