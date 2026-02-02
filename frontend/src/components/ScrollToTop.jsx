import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, search } = useLocation();
  const prevLocationRef = useRef({ pathname, search });
  const hasMountedRef = useRef(false);

  useEffect(() => {
    const pathnameChanged = prevLocationRef.current.pathname !== pathname;
    const shouldScroll = !hasMountedRef.current || pathnameChanged;

    // Only scroll on initial mount or pathname change (route navigation)
    if (shouldScroll) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      });
    }

    hasMountedRef.current = true;
    prevLocationRef.current = { pathname, search };
  }, [pathname, search]);

  return null;
}
