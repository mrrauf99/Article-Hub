import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigation } from "react-router-dom";

/**
 * Professional top navigation progress bar
 * Shows during route transitions with smooth animation
 */
export default function NavigationProgress() {
  const navigation = useNavigation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);
  const wasNavigatingRef = useRef(false);

  const isNavigating = navigation.state === "loading";

  const startProgress = useCallback(() => {
    setVisible(true);
    setProgress(0);

    let currentProgress = 0;
    intervalRef.current = setInterval(() => {
      currentProgress += Math.random() * 15;
      if (currentProgress > 90) {
        currentProgress = 90;
        clearInterval(intervalRef.current);
      }
      setProgress(currentProgress);
    }, 200);
  }, []);

  const completeProgress = useCallback(() => {
    clearInterval(intervalRef.current);
    setProgress(100);

    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  }, []);

  useEffect(() => {
    // Only trigger on state changes
    if (isNavigating && !wasNavigatingRef.current) {
      // Started navigating
      queueMicrotask(startProgress);
    } else if (!isNavigating && wasNavigatingRef.current) {
      // Finished navigating
      queueMicrotask(completeProgress);
    }

    wasNavigatingRef.current = isNavigating;

    return () => {
      clearInterval(intervalRef.current);
      clearTimeout(timeoutRef.current);
    };
  }, [isNavigating, startProgress, completeProgress]);

  if (!visible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px] bg-transparent">
      {/* Progress bar */}
      <div
        className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          boxShadow:
            "0 0 10px rgba(37, 99, 235, 0.7), 0 0 5px rgba(56, 189, 248, 0.5)",
        }}
      />

      {/* Glow effect at the end */}
      <div
        className="absolute top-0 h-full w-24 transition-all duration-300 ease-out"
        style={{
          right: `${100 - progress}%`,
          background:
            "linear-gradient(to right, transparent, rgba(56, 189, 248, 0.4))",
          filter: "blur(3px)",
        }}
      />

      {/* Shimmer effect */}
      <div
        className="absolute top-0 h-full overflow-hidden transition-all duration-300"
        style={{ width: `${progress}%` }}
      >
        <div
          className="h-full w-32 animate-shimmer"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
          }}
        />
      </div>
    </div>
  );
}
