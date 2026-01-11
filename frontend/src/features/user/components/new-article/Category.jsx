import CategoryFilter from "@/components/CategoryFilter";
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
  placeholder = "Select a category",
  required,
}) {
  // Add empty option to beginning of categories
  const categoriesWithEmpty = ["", ...options];

  const handleCategoryChange = (selectedCategory) => {
    // Create a synthetic event to match the expected onChange format
    const syntheticEvent = {
      target: {
        name: name,
        value: selectedCategory,
      },
    };
    onChange(syntheticEvent);
  };

  return (
    <div className={styles.group}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          <span>
            {label} {required && <span className={styles.required}>*</span>}
          </span>
        </label>
      )}

      <CategoryFilter
        categories={categoriesWithEmpty}
        activeCategory={value || ""}
        onChange={handleCategoryChange}
        onBlur={onBlur}
        name={name}
        variant="light"
        placeholder={placeholder}
        error={error}
      />
      
      {/* Hidden input to ensure category value is submitted with form */}
      <input type="hidden" name={name} value={value || ""} />

      {error && <p className={styles.errorMsg}>{error}</p>}
    </div>
  );
}
