import "../../styles/image-upload.css";
export default function ImageUpload({
  label,
  id,
  name,
  onChange,
  error,
  image,
  imagePreview,
  required,
}) {
  return (
    <div className="image-upload-group">
      {label && (
        <label htmlFor={id}>
          {label} {required && <span className="required">*</span>}
        </label>
      )}
      <div className="image-upload-wrapper">
        <input
          type="file"
          id={id}
          name={name}
          accept="image/*"
          onChange={onChange}
          className="file-input"
        />
        <label htmlFor={id} className="file-label">
          <span className="upload-icon">📁</span>
          <span className="upload-text">
            {image ? image.name : "Choose an image file"}
          </span>
          <span className="upload-hint">JPG, PNG, GIF (Max 5MB)</span>
        </label>
      </div>
      {error && <p className="error-msg">{error}</p>}
      {imagePreview && (
        <div className="image-preview">
          <img src={imagePreview} alt="Preview" />
        </div>
      )}
    </div>
  );
}
