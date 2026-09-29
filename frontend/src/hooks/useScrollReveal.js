import { useEffect, useRef, useState } from "react";

export function useScrollReveal(options = {}) {
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const [isVisible, setIsVisible] = useState(prefersReducedMotion);
  const ref = useRef(null);

  // Depend on primitives, not `options` itself — every caller passes a
  // fresh object literal each render, which previously tore down and
  // recreated the IntersectionObserver (and re-ran this effect) on every
  // re-render of every revealed card instead of only on mount.
  const threshold = options.threshold || 0.1;
  const rootMargin = options.rootMargin || "0px 0px -50px 0px";

  useEffect(() => {
    if (prefersReducedMotion) return;

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Once visible, stay visible (don't hide on scroll up)
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [prefersReducedMotion, threshold, rootMargin]);

  return [ref, isVisible];
}
