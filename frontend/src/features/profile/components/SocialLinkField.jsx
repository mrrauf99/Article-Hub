import {
  EMPTY_VALUE,
  FIELD_GROUP,
  FIELD_INPUT,
  FIELD_LABEL,
  READ_LABEL,
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
  const id = `profile-${name}`;

  if (isEditing) {
    return (
      <div className={FIELD_GROUP}>
        <label htmlFor={id} className={FIELD_LABEL}>
          {label}
        </label>
        <input
          id={id}
          type="url"
          name={name}
          value={value || ""}
          onChange={onChange}
          placeholder={placeholder}
          className={FIELD_INPUT}
        />
      </div>
    );
  }

  return (
    <div className={`${FIELD_GROUP} flex items-start gap-3`}>
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink/[0.05] text-ink-muted">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <dt className={READ_LABEL}>{label}</dt>
        <dd className="mt-0.5 truncate text-[0.9375rem]">
          {value ? (
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-moss-700 underline-offset-4 hover:underline"
            >
              {value.replace(/^https?:\/\/(www\.)?/, "")}
            </a>
          ) : (
            <span className={EMPTY_VALUE}>Not added</span>
          )}
        </dd>
      </div>
    </div>
  );
}
