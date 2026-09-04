import { control } from "@/styles/panelClasses";
import FieldShell, { describedBy } from "./FieldShell";

export default function TextArea({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  hint,
  placeholder,
  rows = 4,
  maxLength,
  charCount,
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
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        aria-invalid={Boolean(error) || undefined}
        aria-describedby={describedBy(id, { hint, error, maxLength })}
        className={`${control(Boolean(error))} block resize-y px-4 py-3 text-base leading-7`}
      />
    </FieldShell>
  );
}
