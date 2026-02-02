import styles from "../../styles/ArticleForm.module.css";

export default function TextArea({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  rows = 4,
  maxLength,
  charCount,
  required,
}) {
  return (
    <div className={styles.group}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          <span>
            {label} {required && <span className={styles.required}>*</span>}
          </span>

          {charCount !== undefined && maxLength && (
            <span className={styles.charCount}>
              {charCount} / {maxLength}
            </span>
          )}
        </label>
      )}

      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        rows={rows}
        className={`${styles.control} ${styles.textarea} ${
          error ? styles.errorControl : ""
        }`}
      />

      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
}
