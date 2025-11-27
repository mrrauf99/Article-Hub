import { useState } from "react";
import "../../styles/auth/loader.css";

export default function Input({
  label,
  id,
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
            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer w-5 h-5"
          />
        )}

        {/* LOADER (only when loading) */}
        {isLoading && <span className="absolute right-3 loader"></span>}
      </div>

      {error && <p className="text-red-600 text-sm my-1 text-left">{error}</p>}
    </div>
  );
}
