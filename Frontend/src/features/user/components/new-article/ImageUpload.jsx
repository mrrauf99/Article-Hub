import styles from "../../styles/ArticleForm.module.css";

export default function ImageUpload({
  label,
  id,
  name,
  onChange,
  error,
  imageFile,
  imageUrl,
  required,
}) {
  return (
    <div className={styles.imageUploadGroup}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label} {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.imageUploadWrapper}>
        <input
          type="file"
          id={id}
          name={name}
          accept="image/*"
          onChange={onChange}
          className={styles.fileInput}
        />

        <label htmlFor={id} className={styles.fileLabel}>
          <span className={styles.uploadIcon}>📁</span>

          <span className={styles.uploadText}>
            {imageFile
              ? imageFile.name
              : imageUrl
              ? "Current image selected"
              : "Choose an image file"}
          </span>

          <span className={styles.uploadHint}>JPG, PNG, GIF (Max 5MB)</span>
        </label>
      </div>

      {error && <p className={styles.errorMsg}>{error}</p>}

      {imageUrl && (
        <div className={styles.imagePreview}>
          <img src={imageUrl} alt="Preview" />
        </div>
      )}
    </div>
  );
}
