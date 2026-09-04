import { ChevronDown } from "lucide-react";
import { control } from "@/styles/panelClasses";
import FieldShell, { describedBy } from "./FieldShell";

export default function Category({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  hint,
  options,
  placeholder = "Choose a category",
}) {
  return (
    <FieldShell id={id} label={label} hint={hint} error={error}>
      <div className="relative">
        <select
          id={id}
          name={name}
          value={value || ""}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={describedBy(id, { hint, error })}
          className={`${control(Boolean(error))} h-12 cursor-pointer appearance-none pl-4 pr-10 text-[0.9375rem] ${
            value ? "" : "text-ink-faint"
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option} value={option} className="text-ink">
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted"
          aria-hidden="true"
        />
      </div>
    </FieldShell>
  );
}
