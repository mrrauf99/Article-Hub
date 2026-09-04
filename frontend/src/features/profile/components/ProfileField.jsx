import {
  EMPTY_VALUE,
  FIELD_GROUP,
  FIELD_INPUT,
  FIELD_LABEL,
  READ_LABEL,
  READ_VALUE,
} from "../styles/profileClasses";

export default function ProfileField({
  label,
  value,
  name,
  isEditing,
  onChange,
  disabled = false,
  type = "text",
  rows,
  placeholder,
  className = "",
}) {
  const id = `profile-${name}`;

  if (isEditing && !disabled) {
    return (
      <div className={`${FIELD_GROUP} ${className}`}>
        <label htmlFor={id} className={FIELD_LABEL}>
          {label}
        </label>
        {rows ? (
          <textarea
            id={id}
            name={name}
            value={value || ""}
            onChange={onChange}
            rows={rows}
            placeholder={placeholder}
            className={`${FIELD_INPUT} resize-y leading-relaxed`}
          />
        ) : (
          <input
            id={id}
            type={type}
            name={name}
            value={value || ""}
            onChange={onChange}
            placeholder={placeholder}
            className={FIELD_INPUT}
          />
        )}
      </div>
    );
  }

  const isLink = type === "url" && value;

  return (
    <div className={`${FIELD_GROUP} ${className}`}>
      <dt className={READ_LABEL}>{label}</dt>
      <dd className={`${READ_VALUE} ${rows ? "whitespace-pre-line leading-relaxed" : ""}`}>
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-moss-700 underline-offset-4 hover:underline"
          >
            {value}
          </a>
        ) : (
          value || <span className={EMPTY_VALUE}>Not added</span>
        )}
      </dd>
    </div>
  );
}
