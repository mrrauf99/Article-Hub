import { useState } from "react";

export default function Input({
  label,
  id,
  error,
  eyeShow,
  eyeHidden,
  type,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-wrapper">
        <input
          id={id}
          type={isPassword ? (showPassword ? "text" : "password") : type}
          {...props}
        />
        {isPassword && (
          <img
            onClick={() => setShowPassword((prev) => !prev)}
            src={showPassword ? eyeShow : eyeHidden}
            alt="Toggle Password"
          />
        )}
      </div>
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}
