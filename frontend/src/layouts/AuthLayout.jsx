import { Suspense } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Outlet, useLocation } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import NavigationProgress from "@/components/NavigationProgress";
import SEO from "@/components/SEO";
import PageLoader from "@/components/PageLoader";

const AUTH_PAGE_TITLES = {
  "/login": "Sign In",
  "/register": "Create Account",
  "/verify-otp": "Verify Your Email",
  "/forgot-password": "Forgot Password",
  "/reset-password": "Reset Password",
  "/two-factor": "Two-Factor Authentication",
  "/complete-profile": "Complete Your Profile",
};

export default function AuthLayout() {
  const location = useLocation();
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const authContent = (
    <Suspense fallback={<PageLoader />}>
      <Outlet />
    </Suspense>
  );

  return (
    <>
      <SEO
        title={AUTH_PAGE_TITLES[location.pathname] || "Account"}
        canonicalPath={location.pathname}
        noindex
        nofollow
      />
      <ScrollToTop />
      <NavigationProgress />
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          {authContent}
        </GoogleOAuthProvider>
      ) : (
        authContent
      )}
    </>
  );
}
