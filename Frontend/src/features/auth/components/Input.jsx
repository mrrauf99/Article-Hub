import { useState } from "react";
import styles from "../styles/Input.module.css";

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
  placeholder,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative">
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.wrapper}>
        <input
          id={id}
          type={isPassword && showPassword ? "text" : type}
          name={name}
          value={enteredValue}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`${styles.input} ${
            isPassword ? styles.passwordInput : ""
          }`}
          placeholder={placeholder}
        />

        {eyeShow && eyeHidden && (
          <img
            src={showPassword ? eyeShow : eyeHidden}
            alt="Toggle Password"
            onClick={() => setShowPassword((prev) => !prev)}
            className={styles.eyeIcon}
          />
        )}

        {isLoading && (
          <span className="absolute right-3 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-indigo-500" />
        )}
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
}
