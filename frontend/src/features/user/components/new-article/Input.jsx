import styles from "../../styles/ArticleForm.module.css";

export default function Input({
  label,
  id,
  name,
  value,
  type = "text",
  onChange,
  onBlur,
  error,
  placeholder,
  required,
  maxLength,
  charCount,
}) {
  return (
    <div className={styles.group}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          <span>
            {label} {required && <span className={styles.required}>*</span>}
          </span>
          {maxLength && (
            <span className={styles.charCount}>
              {charCount} / {maxLength}
            </span>
          )}
        </label>
      )}

      <input
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`${styles.control} ${error ? styles.errorControl : ""}`}
      />

      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
}
