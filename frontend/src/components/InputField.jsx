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
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

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
        "w-full rounded-xl border px-4 py-3.5 outline-none transition-all",
        "bg-white text-slate-900 placeholder-slate-400",
        Icon ? "pl-12" : "",
        isPassword || loading || error || success ? "pr-12" : "",
        error
          ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
          : "border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
        "disabled:bg-slate-50 disabled:cursor-not-allowed",
        "hover:border-slate-400 shadow-sm",
      ]
        .filter(Boolean)
        .join(" "),
    [Icon, isPassword, loading, error, success]
  );

  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
        )}

        <input
          {...props}
          type={resolvedType}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled || loading}
          placeholder={placeholder}
          className={inputClassName}
        />

        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {loading && (
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
          )}

          {showSuccessIcon && (
            <CheckCircle className="h-5 w-5 text-emerald-500" />
          )}

          {showErrorIcon && <XCircle className="h-5 w-5 text-red-500" />}

          {isPassword && !loading && (
            <button
              type="button"
              onClick={togglePasswordVisibility}
              tabIndex={-1}
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-sm text-red-600 mt-1.5">{error}</p>}
    </div>
  );
}
