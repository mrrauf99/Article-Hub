import {
  EMPTY_VALUE,
  FIELD_GROUP,
  FIELD_LABEL,
  READ_LABEL,
  READ_VALUE,
} from "../styles/profileClasses";

export default function ProfileRadioField({
  label,
  value,
  name,
  isEditing,
  onChange,
  options = [],
  className = "",
}) {
  if (!isEditing) {
    return (
      <div className={`${FIELD_GROUP} ${className}`}>
        <dt className={READ_LABEL}>{label}</dt>
        <dd className={READ_VALUE}>
          {value ? (
            options.find((opt) => opt.value === value)?.label || value
          ) : (
            <span className={EMPTY_VALUE}>Not added</span>
          )}
        </dd>
      </div>
    );
  }

  return (
    <fieldset className={`${FIELD_GROUP} ${className}`}>
      <legend className={FIELD_LABEL}>{label}</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {options.map((option) => {
          const checked = value === option.value;
          return (
            <label
              key={option.value}
              className={`relative flex h-10 cursor-pointer items-center rounded-full border px-4 text-sm transition-colors duration-150 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-moss-600 has-[:focus-visible]:ring-offset-2 ${
                checked
                  ? "border-ink bg-ink text-paper"
                  : "border-hairline-strong bg-paper-raised text-ink-muted hover:border-ink-faint hover:text-ink"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={onChange}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
