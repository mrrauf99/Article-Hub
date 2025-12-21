import { useState } from "react";
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function InputField({
  label,
  icon: Icon,
  type = "text",
  value = "",
  onChange,
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
  const resolvedType = isPassword && showPassword ? "text" : type;

  const hasValue = value.toString().length > 0;

  // ✅ Password fields NEVER show X icon
  const showErrorIcon = Boolean(error) && hasValue && !loading && !isPassword;

  const showSuccessIcon = Boolean(success) && hasValue && !loading;

  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none" />
        )}

        <input
          {...props}
          type={resolvedType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled || loading}
          placeholder={placeholder}
          className={`
            w-full rounded-lg border px-4 py-3 outline-none transition-all
            ${Icon ? "pl-11" : ""}
            ${isPassword || loading || error || success ? "pr-11" : ""}
            ${
              error
                ? "border-red-500 focus:border-red-500"
                : "border-slate-300 focus:border-blue-600"
            }
            disabled:bg-slate-100 disabled:cursor-not-allowed
          `}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
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
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              className="text-slate-400 hover:text-slate-600"
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

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
