import { useState } from "react";
import "../../styles/auth/loader.css";

export default function Input({
  label,
  id,
  name,
  type,
  enteredValue,
  handleChange,
  handleBlur,
  error,
  eyeShow,
  eyeHidden,
  isLoading,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="input-group relative">
      {label && <label htmlFor={id}>{label}</label>}

      <div className="input-wrapper relative">
        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          name={name}
          value={enteredValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className="pr-10"
        />

        {/* PASSWORD EYE ICON */}
        {eyeShow && eyeHidden && (
          <img
            src={showPassword ? eyeShow : eyeHidden}
            alt="Toggle Password"
            onClick={() => setShowPassword((prev) => !prev)}
          />
        )}

        {/* LOADER (only when loading) */}
        {isLoading && <span className="absolute right-3 loader"></span>}
      </div>

      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}
