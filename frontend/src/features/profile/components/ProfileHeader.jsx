import { useRef, useState, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { Camera, Check, Loader2, Mail, PenLine, X } from "lucide-react";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { useProfile } from "../hooks/useProfile";
import { BTN_GHOST, BTN_PRIMARY, BTN_SECONDARY } from "@/styles/panelClasses";
import useModalFocusTrap from "@/hooks/useModalFocusTrap";

export default function ProfileHeader() {
  const { user, formData, isEditing, handleChange, handleEdit, canEdit } =
    useProfile();
  const fileInputRef = useRef(null);
  const [showCropper, setShowCropper] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const [avatarError, setAvatarError] = useState(null);

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      setAvatarError(null);
      fileInputRef.current.click();
    }
  };

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    resetFileInput();

    if (!file.type.startsWith("image/")) {
      setAvatarError("Only image files are allowed (JPG, PNG, GIF)");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError(
        "Image size should be less than 2MB. Please compress or choose a smaller image.",
      );
      return;
    }

    setAvatarError(null);

    // Show cropper for avatar (circular crop)
    const reader = new FileReader();
    reader.onload = () => {
      setTempImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (croppedFile, croppedPreviewUrl) => {
    handleChange({
      target: { name: "avatarPreview", value: croppedPreviewUrl },
    });
    handleChange({ target: { name: "avatarFile", value: croppedFile } });
    setTempImageSrc(null);
    setShowCropper(false);
    resetFileInput();
  };

  const handleCloseCropper = () => {
    setShowCropper(false);
    setTempImageSrc(null);
    resetFileInput();
  };

  const displayAvatar = formData.avatarPreview || user.avatar_url;
  const joined = formatJoined(formData.joined_at || user.joined_at);
  const displayName = formData.name || user.name || user.username;

  const avatar = displayAvatar ? (
    <img src={displayAvatar} alt="" className="h-full w-full object-cover" />
  ) : (
    <span className="text-3xl font-semibold text-paper">
      {user.username.charAt(0).toUpperCase()}
    </span>
  );

  return (
    <>
      <section className="flex flex-col gap-6 px-5 py-8 sm:flex-row sm:items-center sm:px-8">
        <div className="relative shrink-0">
          {isEditing ? (
            <button
              type="button"
              onClick={handleAvatarClick}
              className="group relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-moss-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 focus-visible:ring-offset-2"
              aria-label="Change profile photo"
            >
              {avatar}
              <span className="absolute inset-x-0 bottom-0 flex h-7 items-center justify-center bg-ink-950/70 text-paper">
                <Camera className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </button>
          ) : (
            <span className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-moss-700">
              {avatar}
            </span>
          )}

          <input
            ref={fileInputRef}
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            tabIndex={-1}
          />
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate font-editorial text-2xl leading-tight text-ink sm:text-[1.75rem]">
            {displayName}
          </h2>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
            <span>@{user.username}</span>
            {user.email && (
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 shrink-0 text-ink-faint" aria-hidden="true" />
                <span className="truncate">{user.email}</span>
              </span>
            )}
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            <span className="font-medium text-ink">
              {user.role === "admin" ? "Administrator" : "Writer"}
            </span>
            {joined && <> since {joined}</>}
          </p>
          {isEditing && (
            <p className="mt-2 text-xs text-ink-muted">
              Select the photo to replace it. JPG, PNG, or GIF up to 2 MB.
            </p>
          )}
        </div>

        {!isEditing && canEdit && (
          <button type="button" onClick={handleEdit} className={`${BTN_SECONDARY} self-start sm:self-center`}>
            <PenLine className="h-4 w-4" aria-hidden="true" />
            Edit profile
          </button>
        )}
      </section>

      {avatarError && (
        <div
          role="alert"
          className="mx-5 mb-6 rounded-lg border border-rejected-red-ring bg-rejected-red-bg px-4 py-3 text-sm text-rejected-red-text sm:mx-8"
        >
          <p className="font-semibold">That photo can't be used.</p>
          <p className="mt-0.5">{avatarError}</p>
        </div>
      )}

      {showCropper && tempImageSrc && (
        <AvatarCropper
          imageSrc={tempImageSrc}
          onClose={handleCloseCropper}
          onCropComplete={handleCropComplete}
        />
      )}
    </>
  );
}

function formatJoined(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return null;
  return new Intl.DateTimeFormat("en-GB", { year: "numeric", month: "long" }).format(date);
}

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

function AvatarCropper({ imageSrc, onClose, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const modalRef = useRef(null);
  const dialogRef = useRef(null);

  useModalFocusTrap(dialogRef, Boolean(imageSrc));

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteCallback = useCallback(
    (croppedArea, croppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return null;

    const size = Math.min(pixelCrop.width, pixelCrop.height);
    canvas.width = size;
    canvas.height = size;

    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.clip();

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    ctx.drawImage(
      image,
      pixelCrop.x * scaleX,
      pixelCrop.y * scaleY,
      pixelCrop.width * scaleX,
      pixelCrop.height * scaleY,
      0,
      0,
      size,
      size,
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const fileUrl = URL.createObjectURL(blob);
          resolve({ fileUrl, blob });
        },
        "image/jpeg",
        0.9,
      );
    });
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);

      if (croppedImage) {
        const file = new File([croppedImage.blob], `avatar-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        onCropComplete(file, croppedImage.fileUrl);
        onClose();
      }
    } catch (error) {
      console.error("Error cropping avatar:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useLayoutEffect(() => {
    const scrollY = window.scrollY;
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalPosition = window.getComputedStyle(document.body).position;
    const originalTop = window.getComputedStyle(document.body).top;
    const originalWidth = window.getComputedStyle(document.body).width;

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    const handleEscape = (e) => {
      if (e.key === "Escape" && !isProcessing) {
        onClose();
      }
    };

    const handleTouchMove = (e) => {
      if (modalRef.current && modalRef.current.contains(e.target)) {
        return;
      }
      e.preventDefault();
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("touchmove", handleTouchMove);
      document.body.style.overflow = originalStyle;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;
      window.scrollTo(0, scrollY);
    };
  }, [onClose, isProcessing]);

  if (!imageSrc) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ paddingTop: "4rem", paddingBottom: "2rem" }}
    >
      <div className="absolute inset-0 bg-ink-950/50" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-cropper-title"
        className="relative w-full max-w-md mx-4 bg-paper-raised rounded-xl shadow-[0_24px_48px_-12px_rgba(20,20,15,0.35)] overflow-hidden flex flex-col z-10 font-ui"
        style={{ maxHeight: "calc(100vh - 6rem)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-hairline">
          <h2 id="avatar-cropper-title" className="text-base font-semibold text-ink">Crop profile photo</h2>
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-muted hover:bg-ink/5 hover:text-ink transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div
          className="relative w-full bg-ink-950"
          style={{ height: "400px", minHeight: "400px" }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={0}
            aspect={1}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onRotationChange={() => {}}
            onCropComplete={onCropCompleteCallback}
            cropShape="round"
            showGrid={false}
            restrictPosition={true}
            style={{
              containerStyle: {
                width: "100%",
                height: "100%",
                position: "relative",
              },
            }}
          />
        </div>

        <div className="px-5 py-4 border-t border-hairline">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className={BTN_GHOST}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className={BTN_PRIMARY}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                  Processing…
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" aria-hidden="true" />
                  Use photo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
