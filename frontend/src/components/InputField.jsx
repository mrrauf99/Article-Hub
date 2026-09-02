import { useState, useMemo, useCallback } from "react";
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { control, FIELD_LABEL, FIELD_ERROR } from "@/styles/panelClasses";

export default function InputField({
  label,
  icon: Icon,
  type = "text",
  value = "",
  onChange,
  onFocus,
  onBlur,
  placeholder,
  error,
  success,
  loading,
  disabled,
  id,
  name,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const inputId = id || name;
  const errorId = inputId ? `${inputId}-error` : undefined;

  const isPassword = type === "password";
  const resolvedType = useMemo(
    () => (isPassword && showPassword ? "text" : type),
    [isPassword, showPassword, type]
  );

  const hasValue = useMemo(() => value.toString().length > 0, [value]);

  // Password fields NEVER show X icon
  const showErrorIcon = useMemo(
    () => Boolean(error) && hasValue && !loading && !isPassword,
    [error, hasValue, loading, isPassword]
  );

  const showSuccessIcon = useMemo(
    () => Boolean(success) && hasValue && !loading,
    [success, hasValue, loading]
  );

  const inputClassName = useMemo(
    () =>
      [
        control(Boolean(error)),
        "px-4 py-3",
        Icon ? "pl-11" : "",
        isPassword || loading || error || success ? "pr-11" : "",
      ]
        .filter(Boolean)
        .join(" "),
    [Icon, isPassword, loading, error, success]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className={FIELD_LABEL}>
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[1.1rem] w-[1.1rem] text-ink-faint pointer-events-none" />
        )}

        <input
          {...props}
          id={inputId}
          name={name}
          type={resolvedType}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled || loading}
          placeholder={placeholder}
          className={inputClassName}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={error ? errorId : undefined}
        />

        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && (
            <Loader2 className="h-[1.1rem] w-[1.1rem] animate-spin text-ink-faint" />
          )}

          {showSuccessIcon && (
            <CheckCircle className="h-[1.1rem] w-[1.1rem] text-moss-600" />
          )}

          {showErrorIcon && <XCircle className="h-[1.1rem] w-[1.1rem] text-red-600" />}

          {isPassword && !loading && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-ink-faint hover:text-ink-muted transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 focus-visible:ring-offset-1 rounded"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="h-[1.1rem] w-[1.1rem]" />
              ) : (
                <EyeOff className="h-[1.1rem] w-[1.1rem]" />
              )}
            </button>
          )}
        </div>
      </div>

      {error && (
        <p id={errorId} className={`${FIELD_ERROR} mt-1.5`}>
          {error}
        </p>
      )}
    </div>
  );
}
