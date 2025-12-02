import "../../styles/category.css";

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
    <div className="category-group">
      {label && (
        <label htmlFor={id}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={error ? "error" : ""}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}
