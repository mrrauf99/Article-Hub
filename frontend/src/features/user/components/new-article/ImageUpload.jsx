import { useState } from "react";
import { ImagePlus } from "lucide-react";
import ImageCropper from "@/components/image/ImageCropper";
import styles from "../../styles/ArticleForm.module.css";

export default function ImageUpload({
  id,
  name,
  onChange,
  error,
  imageFile,
  imageUrl,
}) {
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      if (onChange) {
        onChange({
          ...e,
          target: {
            ...e.target,
            error: "Only image files are allowed",
          },
        });
      }
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      if (onChange) {
        onChange({
          ...e,
          target: {
            ...e.target,
            error: "Image size should be less than 5MB",
          },
        });
      }
      return;
    }

    // Show cropper instead of directly setting the image
    const reader = new FileReader();
    reader.onload = () => {
      setTempImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedFile, croppedPreviewUrl) => {
    // Call the onChange handler with cropped file and preview URL
    // The hook will handle updating the form data
    if (onChange) {
      // Create synthetic event that includes both file and preview URL
      const syntheticEvent = {
        target: {
          name: name || "image",
          files: [croppedFile],
          value: "",
        },
        croppedFile: croppedFile,
        croppedPreviewUrl: croppedPreviewUrl,
      };

      onChange(syntheticEvent);
    }

    // Clean up
    setTempImageSrc(null);
    setShowCropper(false);
  };

  const handleCloseCropper = () => {
    setShowCropper(false);
    setTempImageSrc(null);
    // Reset file input
    const input = document.getElementById(id);
    if (input) {
      input.value = "";
    }
  };

  return (
    <>
      <div className={styles.imageUploadGroup}>
        <div className={styles.imageUploadWrapper}>
          <input
            type="file"
            id={id}
            name={name}
            accept="image/*"
            onChange={handleFileSelect}
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

      {/* Image Cropper Modal */}
      {showCropper && tempImageSrc && (
        <ImageCropper
          imageSrc={tempImageSrc}
          onClose={handleCloseCropper}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
}
