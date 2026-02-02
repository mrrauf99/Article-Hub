import { createPortal } from "react-dom";

export default function LoadingOverlay({ isLoading, message = "Loading..." }) {
  if (!isLoading) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center gap-4">
        {/* Animated Dots */}
        <div className="flex gap-2">
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{
              animationDelay: "0s",
              animationDuration: "1.4s",
            }}
          />
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{
              animationDelay: "0.2s",
              animationDuration: "1.4s",
            }}
          />
          <div
            className="w-3 h-3 bg-white rounded-full animate-bounce"
            style={{
              animationDelay: "0.4s",
              animationDuration: "1.4s",
            }}
          />
        </div>

        {/* Loading Message */}
        <p className="text-white text-sm font-medium mt-2">{message}</p>
      </div>
    </div>,
    document.getElementById("modal-root"),
  );
}
