import { useRef, useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Mail, Award, Edit2, Pencil, X, Check } from "lucide-react";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { useProfile } from "../../hooks/useProfile";

export default function ProfileHeader({ user, isEditing, onEdit }) {
  const { formData, handleChange } = useProfile();
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
      setAvatarError("Image size should be less than 2MB. Please compress or choose a smaller image.");
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
    handleChange({ target: { name: "avatarPreview", value: croppedPreviewUrl } });
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

  const displayAvatar = formData.avatarPreview || user.avatar_url || user.avatar;

  return (
    <>
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-5">
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-6 w-full sm:w-auto">
            <div className="relative flex-shrink-0 group">
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt={user.username}
                  className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full object-cover shadow-lg border-3 sm:border-4 border-white transition-transform ${
                    isEditing ? "cursor-pointer hover:scale-105" : ""
                  }`}
                  onClick={handleAvatarClick}
                  loading="lazy"
                />
              ) : (
                <div
                  className={`w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-white rounded-full flex items-center justify-center text-indigo-600 text-xl sm:text-2xl lg:text-3xl font-bold shadow-lg transition-transform ${
                    isEditing ? "cursor-pointer hover:scale-105" : ""
                  }`}
                  onClick={handleAvatarClick}
                >
                  {user.username.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Edit pencil icon - only shows in edit mode */}
              {isEditing && (
                <div
                  className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 bg-indigo-500 rounded-full flex items-center justify-center cursor-pointer border-2 sm:border-3 border-white shadow-md hover:bg-indigo-600 transition-all hover:scale-110 z-10"
                  onClick={handleAvatarClick}
                  title="Change avatar"
                >
                  <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </div>
              )}

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 truncate">
                {user.username}
              </h1>
              <p className="text-blue-100 flex items-center gap-2 mb-2 text-xs sm:text-sm lg:text-base truncate">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="truncate">{user.email}</span>
              </p>
              <div className="flex items-center gap-2 text-blue-200">
                <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                <span className="text-xs sm:text-xs lg:text-sm">
                  {user.role === "admin" ? "Administrator" : "Contributing Writer"}
                </span>
              </div>
            </div>
          </div>
          {!isEditing && (
            <button
              onClick={onEdit}
              className="w-full sm:w-auto bg-white text-indigo-600 px-5 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold hover:bg-indigo-50 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 whitespace-nowrap text-sm sm:text-base"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Avatar Upload Error Message */}
      {avatarError && (
        <div className="mx-4 sm:mx-6 lg:mx-8 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
          <p className="font-medium">Avatar Upload Error</p>
          <p className="text-xs mt-1">{avatarError}</p>
        </div>
      )}

      {/* Image Cropper Modal for Avatar (circular) */}
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

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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
      size
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) return;
        const fileUrl = URL.createObjectURL(blob);
        resolve({ fileUrl, blob });
      }, "image/jpeg", 0.9);
    });
  };

  const handleSave = async () => {
    if (!croppedAreaPixels) return;

    setIsProcessing(true);
    try {
      const croppedImage = await getCroppedImg(
        imageSrc,
        croppedAreaPixels
      );

      if (croppedImage) {
        const file = new File(
          [croppedImage.blob],
          `avatar-${Date.now()}.jpg`,
          { type: "image/jpeg" }
        );
        
        onCropComplete(file, croppedImage.fileUrl);
        onClose();
      }
    } catch (error) {
      console.error("Error cropping avatar:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && !isProcessing) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, isProcessing]);

  if (!imageSrc) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ paddingTop: '4rem', paddingBottom: '2rem' }}
    >
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
      />
      <div 
        className="relative w-full max-w-md mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10" 
        style={{ maxHeight: 'calc(100vh - 6rem)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Crop Avatar</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="relative w-full bg-slate-100" style={{ height: '400px', minHeight: '400px' }}>
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

        <div className="p-4 sm:p-6 border-t border-slate-200">
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Apply Crop
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
