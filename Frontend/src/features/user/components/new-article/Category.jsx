import styles from "../../styles/ArticleForm.module.css";

export default function Category({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  error,
  options,
  placeholder = "Select an option",
  required,
}) {
  return (
    <div className={styles.group}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          <span>
            {label} {required && <span className={styles.required}>*</span>}
          </span>
        </label>
      )}

      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`${styles.control} ${styles.select} ${
          error ? styles.errorControl : ""
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
}
