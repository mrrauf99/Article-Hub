import { ImagePlus } from "lucide-react";
import styles from "../../styles/ArticleForm.module.css";

export default function ImageUpload({
  id,
  name,
  onChange,
  error,
  imageFile,
  imageUrl,
}) {
  return (
    <div className={styles.imageUploadGroup}>
      <div className={styles.imageUploadWrapper}>
        <input
          type="file"
          id={id}
          name={name}
          accept="image/*"
          onChange={onChange}
          className={styles.fileInput}
        />

        <label
          htmlFor={id}
          className={`${styles.fileLabel} ${
            error ? styles.fileLabelError : ""
          }`}
        >
          <div className={styles.uploadIconWrapper}>
            <ImagePlus className="w-6 h-6" />
          </div>

          <span className={styles.uploadText}>
            {imageFile
              ? imageFile.name
              : imageUrl
              ? "Click to change image"
              : "Click to upload an image"}
          </span>

          <span className={styles.uploadHint}>
            Drag and drop or click to browse • JPG, PNG, GIF (Max 5MB)
          </span>
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
