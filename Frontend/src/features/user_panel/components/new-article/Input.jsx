import "../../styles/input.css";

export default function Input({
  label,
  id,
  name,
  value,
  type,
  onChange,
  onBlur,
  error,
  placeholder,
  required,
}) {
  return (
    <div className="input-group">
      {label && (
        <label htmlFor={id}>
          {label} {required && <span className="required">*</span>}
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
        className={error ? "error" : ""}
      />
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}
