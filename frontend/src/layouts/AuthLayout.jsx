import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import NavigationProgress from "@/components/NavigationProgress";
import SEO from "@/components/SEO";
import PageLoader from "@/components/PageLoader";

export default function AuthLayout() {
  const location = useLocation();

  return (
    <>
      <SEO title="Account" canonicalPath={location.pathname} noindex nofollow />
      <ScrollToTop />
      <NavigationProgress />
      <Suspense fallback={<PageLoader />}>
        <Outlet />
      </Suspense>
    </>
  );
}
