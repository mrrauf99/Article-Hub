import { useRef, useState } from "react";
import { ImagePlus, RefreshCw } from "lucide-react";
import ImageCropper from "@/components/image/ImageCropper";
import { allowedImageTypes } from "@/utils/allowedImagesTypes";
import { BTN_SECONDARY, FIELD_ERROR, FIELD_HINT, FIELD_LABEL } from "@/styles/panelClasses";

const MAX_BYTES = 5 * 1024 * 1024;

export default function ImageUpload({ id, name, onChange, error, imageFile, imageUrl }) {
  const inputRef = useRef(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const resetInput = () => {
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFile = (file) => {
    if (!file) return;

    // Invalid files go straight to the form hook, which owns the error messages.
    if (!allowedImageTypes.includes(file.type) || file.size > MAX_BYTES) {
      onChange?.({ target: { name: name || "image", files: [file] } });
      resetInput();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setTempImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedFile, croppedPreviewUrl) => {
    onChange?.({
      target: { name: name || "image", files: [croppedFile], value: "" },
      croppedFile,
      croppedPreviewUrl,
    });
    setTempImageSrc(null);
    setShowCropper(false);
  };

  const handleCloseCropper = () => {
    setShowCropper(false);
    setTempImageSrc(null);
    resetInput();
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const dragProps = {
    onDragOver: (e) => {
      e.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: () => setIsDragging(false),
    onDrop,
  };

  const describedBy = [`${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ");

  return (
    <div>
      <span className={FIELD_LABEL}>Cover image</span>
      <p id={`${id}-hint`} className={`mt-1 ${FIELD_HINT}`}>
        JPG, PNG, or WEBP up to 5 MB. You'll crop it to 16:9 before it's attached.
      </p>

      <input
        ref={inputRef}
        type="file"
        id={id}
        name={name}
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={(e) => handleFile(e.target.files?.[0])}
        aria-describedby={describedBy}
        className="peer sr-only"
      />

      {imageUrl ? (
        <div
          className="mt-3 peer-focus-visible:[&_label]:ring-2 peer-focus-visible:[&_label]:ring-moss-600 peer-focus-visible:[&_label]:ring-offset-2"
          {...dragProps}
        >
          <div
            className={`overflow-hidden rounded-xl border bg-ink/[0.03] transition-colors ${
              isDragging ? "border-moss-600" : "border-hairline"
            }`}
          >
            <img src={imageUrl} alt="Cover preview" className="aspect-video w-full object-cover" />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label htmlFor={id} className={`${BTN_SECONDARY} cursor-pointer`}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              Replace image
            </label>
            {imageFile && (
              <span className="min-w-0 truncate text-sm text-ink-muted">{imageFile.name}</span>
            )}
          </div>
        </div>
      ) : (
        <label
          htmlFor={id}
          {...dragProps}
          className={`mt-3 flex cursor-pointer flex-col peer-focus-visible:ring-2 peer-focus-visible:ring-moss-600 peer-focus-visible:ring-offset-2 items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center transition-colors duration-150 ${
            error
              ? "border-red-400 bg-red-50/40"
              : isDragging
                ? "border-moss-600 bg-moss-50"
                : "border-hairline-strong bg-paper-raised hover:border-ink-faint"
          }`}
        >
          <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-ink/[0.05] text-ink-muted">
            <ImagePlus className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-[0.9375rem] font-semibold text-ink">
            Drop an image here, or choose a file
          </span>
          <span className="mt-1 text-sm text-ink-muted">Wide images work best.</span>
        </label>
      )}

      {error && (
        <p id={`${id}-error`} className={`mt-2 ${FIELD_ERROR}`}>
          {error}
        </p>
      )}

      {showCropper && tempImageSrc && (
        <ImageCropper
          imageSrc={tempImageSrc}
          onClose={handleCloseCropper}
          onCropComplete={handleCropComplete}
        />
      )}
    </div>
  );
}
