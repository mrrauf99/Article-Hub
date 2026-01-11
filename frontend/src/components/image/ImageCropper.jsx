import { useState, useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { X, Check } from "lucide-react";

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.src = url;
  });

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    return null;
  }

  // Target dimensions: 1200x675 (16:9 aspect ratio - modern standard)
  const targetWidth = 1200;
  const targetHeight = 675;

  // Set canvas to target size
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  // Calculate scale factors
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // Draw the cropped image, scaled to target dimensions
  ctx.drawImage(
    image,
    pixelCrop.x * scaleX,
    pixelCrop.y * scaleY,
    pixelCrop.width * scaleX,
    pixelCrop.height * scaleY,
    0,
    0,
    targetWidth,
    targetHeight
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        console.error("Canvas is empty");
        return;
      }
      const fileUrl = URL.createObjectURL(blob);
      resolve({ fileUrl, blob });
    }, "image/jpeg", 0.9);
  });
}

export default function ImageCropper({ imageSrc, onClose, onCropComplete }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const onCropChange = useCallback((crop) => {
    setCrop(crop);
  }, []);

  const onZoomChange = useCallback((zoom) => {
    setZoom(zoom);
  }, []);

  const onCropCompleteCallback = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

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
          `cropped-image-${Date.now()}.jpg`,
          { type: "image/jpeg" }
        );
        
        onCropComplete(file, croppedImage.fileUrl);
        onClose();
      }
    } catch (error) {
      console.error("Error cropping image:", error);
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

  const cropperHeight = isMobile ? '50vh' : 'calc(95vh - 120px)';

  return createPortal(
    <div ref={modalRef} className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm" 
      />
      <div 
        className="relative w-full max-w-4xl bg-white rounded-lg sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10" 
        style={{ maxHeight: '95vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-3 sm:p-4 border-b border-slate-200 flex-shrink-0">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">Crop Image</h2>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600" />
          </button>
        </div>

        <div 
          className="relative w-full bg-slate-100"
          style={{ 
            height: cropperHeight,
            minHeight: '300px',
            maxHeight: cropperHeight
          }}
        >
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={0}
            aspect={16 / 9}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onRotationChange={() => {}}
            onCropComplete={onCropCompleteCallback}
            cropShape="rect"
            showGrid={true}
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

        <div className="p-3 sm:p-4 border-t border-slate-200 flex-shrink-0 bg-white">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2.5 text-slate-700 hover:bg-slate-100 rounded-lg font-medium transition-colors disabled:opacity-50 border border-slate-300 sm:border-0"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isProcessing || !croppedAreaPixels}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
