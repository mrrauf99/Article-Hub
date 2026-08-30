import { useState, useMemo, useCallback } from "react";
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";

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
        "w-full rounded-lg border px-4 py-3 outline-none transition-colors",
        "bg-white text-slate-900 placeholder-slate-500",
        Icon ? "pl-11" : "",
        isPassword || loading || error || success ? "pr-11" : "",
        error
          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/15"
          : "border-slate-300 focus:border-moss-600 focus:ring-2 focus:ring-moss-600/15",
        "disabled:bg-slate-50 disabled:cursor-not-allowed",
        "hover:border-slate-400",
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
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[1.1rem] w-[1.1rem] text-slate-400 pointer-events-none" />
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
            <Loader2 className="h-[1.1rem] w-[1.1rem] animate-spin text-slate-400" />
          )}

          {showSuccessIcon && (
            <CheckCircle className="h-[1.1rem] w-[1.1rem] text-moss-600" />
          )}

          {showErrorIcon && <XCircle className="h-[1.1rem] w-[1.1rem] text-red-500" />}

          {isPassword && !loading && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 focus-visible:ring-offset-1 rounded"
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
        <p id={errorId} className="text-sm text-red-600 mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}
