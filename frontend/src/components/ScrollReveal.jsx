import { useScrollReveal } from "@/hooks/useScrollReveal";

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
}) {
  const [ref, isVisible] = useScrollReveal({ threshold });

  const animations = {
    "fade-up": {
      hidden: "opacity-0 translate-y-4",
      visible: "opacity-100 translate-y-0",
    },
    "fade-down": {
      hidden: "opacity-0 -translate-y-4",
      visible: "opacity-100 translate-y-0",
    },
    "fade-left": {
      hidden: "opacity-0 translate-x-4",
      visible: "opacity-100 translate-x-0",
    },
    "fade-right": {
      hidden: "opacity-0 -translate-x-4",
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
    <div
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
    </div>
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
      hidden: "opacity-0 translate-y-4",
      visible: "opacity-100 translate-y-0",
    },
    "fade-down": {
      hidden: "opacity-0 -translate-y-4",
      visible: "opacity-100 translate-y-0",
    },
    "fade-left": {
      hidden: "opacity-0 translate-x-4",
      visible: "opacity-100 translate-x-0",
    },
    "fade-right": {
      hidden: "opacity-0 -translate-x-4",
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
