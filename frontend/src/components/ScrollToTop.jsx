import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const prevLocationRef = useRef({ pathname, search });

  useEffect(() => {
    const pathnameChanged = prevLocationRef.current.pathname !== pathname;
    
    // Only scroll on pathname change (route navigation), not search param changes (pagination/filters)
    if (pathnameChanged) {
      const scrollToTop = () => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "instant",
        });
      };

      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(scrollToTop);
      });

      prevLocationRef.current = { pathname, search };
    } else {
      // Update search params in ref even if pathname didn't change
      prevLocationRef.current = { pathname, search };
    }
  }, [pathname, search]);

  // Also scroll on initial mount
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  return null;
}
