import { useEffect, useRef } from "react";

export default function useScrollOnChange({
  deps = [],
  behavior = "smooth",
  offset = 0,
  delay = 100,
  enabled = true,
  getTarget,
  shouldScroll,
} = {}) {
  const prevDepsRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const prevDeps = prevDepsRef.current;

    if (!prevDeps) {
      prevDepsRef.current = deps;
      return;
    }

    const changed = deps.some((value, index) => value !== prevDeps[index]);
    if (!changed) return;

    const shouldRun = shouldScroll
      ? shouldScroll({ prev: prevDeps, next: deps })
      : true;

    if (!shouldRun) {
      prevDepsRef.current = deps;
      return;
    }

    const scrollToTarget = () => {
      const target = getTarget ? getTarget() : null;
      if (target) {
        const rect = target.getBoundingClientRect();
        const scrollY = window.pageYOffset || window.scrollY;
        const top = Math.max(0, rect.top + scrollY - offset);
        window.scrollTo({ top, behavior });
      } else {
        window.scrollTo({ top: 0, behavior });
      }
    };

    const timeoutId = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToTarget);
      });
    }, delay);

    prevDepsRef.current = deps;

    return () => clearTimeout(timeoutId);
  }, [behavior, delay, enabled, getTarget, offset, shouldScroll, deps]);
}
