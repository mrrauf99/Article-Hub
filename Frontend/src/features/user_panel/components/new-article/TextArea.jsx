import "../../styles/textarea.css";

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
    <div className="textarea-group">
      {label && (
        <label htmlFor={id}>
          <span>
            {label} {required && <span className="required">*</span>}
          </span>
          {charCount !== undefined && maxLength && (
            <span className="char-count">
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
        maxLength={maxLength}
        className={error ? "error" : ""}
      />
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}
