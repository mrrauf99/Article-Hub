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
  const [themeColor] = useState(() => getThemeColor());
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

  const glowColor = toRgba(themeColor, 0.65);
  const shimmerColor = toRgba(themeColor, 0.35);

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
        className="h-full transition-all duration-300 ease-out"
        style={{
          width: `${progress}%`,
          backgroundColor: themeColor,
          boxShadow: `0 0 10px ${glowColor}, 0 0 5px ${shimmerColor}`,
        }}
      />

      {/* Glow effect at the end */}
      <div
        className="absolute top-0 h-full w-24 transition-all duration-300 ease-out"
        style={{
          right: `${100 - progress}%`,
          background: `linear-gradient(to right, transparent, ${shimmerColor})`,
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
            background: `linear-gradient(90deg, transparent, ${shimmerColor}, transparent)`,
          }}
        />
      </div>
    </div>
  );
}

function toRgba(color, alpha) {
  if (!color) return `rgba(14, 165, 233, ${alpha})`;
  if (color.startsWith("rgba")) return color;
  if (color.startsWith("rgb(")) {
    return color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
  }

  const hex = color.replace("#", "").trim();
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  return `rgba(14, 165, 233, ${alpha})`;
}

function getThemeColor() {
  const metaTheme = document.querySelector('meta[name="theme-color"]');
  if (metaTheme?.content) {
    return metaTheme.content;
  }

  const cssTheme = getComputedStyle(document.documentElement)
    .getPropertyValue("--theme-color")
    .trim();

  return cssTheme || "#0ea5e9";
}
