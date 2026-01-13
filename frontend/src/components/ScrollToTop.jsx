import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const prevLocationRef = useRef({ pathname, search });

  useEffect(() => {
    const pathnameChanged = prevLocationRef.current.pathname !== pathname;
    
    // Only scroll on pathname change (route navigation), not search param changes (pagination/filters)
    if (pathnameChanged) {
      // Scroll immediately multiple times to prevent visible scroll down on mobile
      // This handles timing issues where content renders before scroll happens
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      
      // Use multiple requestAnimationFrame calls to ensure scroll happens after layout
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        });
      });
      
      // Additional scroll after a short delay for mobile browsers
      const timeoutId = setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      }, 0);
      
      return () => clearTimeout(timeoutId);
    }
    
    prevLocationRef.current = { pathname, search };
  }, [pathname, search]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, []);

  return null;
}
