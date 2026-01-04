import { useEffect, useRef, useState } from "react";

/**
 * Custom hook to detect when an element enters the viewport
 * @param {Object} options - Intersection Observer options
 * @returns {Array} [ref, isVisible] - Ref to attach to element and visibility state
 */
export function useScrollReveal(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
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
      {
        threshold: options.threshold || 0.1,
        rootMargin: options.rootMargin || "0px 0px -50px 0px",
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [options.threshold, options.rootMargin]);

  return [ref, isVisible];
}

/**
 * Scroll Reveal wrapper component
 * Wraps children and animates them when they enter viewport
 */
export function ScrollReveal({
  children,
  animation = "fade-up",
  delay = 0,
  duration = 600,
  className = "",
  threshold = 0.1,
  as: Component = "div",
}) {
  const [ref, isVisible] = useScrollReveal({ threshold });

  const animations = {
    "fade-up": {
      hidden: "opacity-0 translate-y-8",
      visible: "opacity-100 translate-y-0",
    },
    "fade-down": {
      hidden: "opacity-0 -translate-y-8",
      visible: "opacity-100 translate-y-0",
    },
    "fade-left": {
      hidden: "opacity-0 translate-x-8",
      visible: "opacity-100 translate-x-0",
    },
    "fade-right": {
      hidden: "opacity-0 -translate-x-8",
      visible: "opacity-100 translate-x-0",
    },
    fade: {
      hidden: "opacity-0",
      visible: "opacity-100",
    },
    scale: {
      hidden: "opacity-0 scale-95",
      visible: "opacity-100 scale-100",
    },
    "scale-up": {
      hidden: "opacity-0 scale-90 translate-y-4",
      visible: "opacity-100 scale-100 translate-y-0",
    },
  };

  const anim = animations[animation] || animations["fade-up"];

  return (
    <Component
      ref={ref}
      className={`transition-all ease-out ${className} ${
        isVisible ? anim.visible : anim.hidden
      }`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </Component>
  );
}

/**
 * Staggered animation for lists/grids
 * Each child animates with increasing delay
 */
export function StaggerReveal({
  children,
  animation = "fade-up",
  baseDelay = 0,
  staggerDelay = 100,
  duration = 600,
  className = "",
  childClassName = "",
  threshold = 0.1,
}) {
  const [ref, isVisible] = useScrollReveal({ threshold });

  const animations = {
    "fade-up": {
      hidden: "opacity-0 translate-y-8",
      visible: "opacity-100 translate-y-0",
    },
    "fade-down": {
      hidden: "opacity-0 -translate-y-8",
      visible: "opacity-100 translate-y-0",
    },
    "fade-left": {
      hidden: "opacity-0 translate-x-8",
      visible: "opacity-100 translate-x-0",
    },
    "fade-right": {
      hidden: "opacity-0 -translate-x-8",
      visible: "opacity-100 translate-x-0",
    },
    fade: {
      hidden: "opacity-0",
      visible: "opacity-100",
    },
    scale: {
      hidden: "opacity-0 scale-95",
      visible: "opacity-100 scale-100",
    },
  };

  const anim = animations[animation] || animations["fade-up"];

  return (
    <div ref={ref} className={className}>
      {Array.isArray(children)
        ? children.map((child, index) => (
            <div
              key={index}
              className={`transition-all ease-out ${childClassName} ${
                isVisible ? anim.visible : anim.hidden
              }`}
              style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${baseDelay + index * staggerDelay}ms`,
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}

export default ScrollReveal;
