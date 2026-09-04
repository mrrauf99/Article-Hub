import { FIELD_ERROR, FIELD_HINT, FIELD_LABEL } from "@/styles/panelClasses";

// Label row (with optional live counter), hint, control slot, and error, wired
// together with ids so the control can reference them via aria-describedby.
export default function FieldShell({
  id,
  label,
  hint,
  error,
  charCount,
  maxLength,
  children,
}) {
  const over = maxLength && charCount > maxLength;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor={id} className={FIELD_LABEL}>
          {label}
        </label>
        {maxLength !== undefined && charCount !== undefined && (
          <span
            id={`${id}-count`}
            className={`text-xs tabular-nums ${over ? "font-semibold text-red-700" : "text-ink-muted"}`}
          >
            {charCount.toLocaleString()} / {maxLength.toLocaleString()}
          </span>
        )}
      </div>
      {hint && (
        <p id={`${id}-hint`} className={`mt-1 ${FIELD_HINT}`}>
          {hint}
        </p>
      )}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} className={`mt-2 ${FIELD_ERROR}`}>
          {error}
        </p>
      )}
    </div>
  );
}

export function describedBy(id, { hint, error, maxLength }) {
  return (
    [hint && `${id}-hint`, maxLength && `${id}-count`, error && `${id}-error`]
      .filter(Boolean)
      .join(" ") || undefined
  );
}
