import { control } from "@/styles/panelClasses";
import FieldShell, { describedBy } from "./FieldShell";

export default function Input({
  label,
  id,
  name,
  value,
  type = "text",
  onChange,
  onBlur,
  error,
  hint,
  placeholder,
  maxLength,
  charCount,
  className = "px-4 py-3 text-[0.9375rem]",
}) {
  return (
    <FieldShell
      id={id}
      label={label}
      hint={hint}
      error={error}
      charCount={charCount}
      maxLength={maxLength}
    >
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy(id, { hint, error, maxLength })}
        className={`${control(Boolean(error))} ${className}`}
      />
    </FieldShell>
  );
}
