import { useState } from "react";
import { Outlet, useLoaderData, useLocation } from "react-router-dom";

import ScrollToTop from "../components/ScrollToTop";
import NavigationProgress from "../components/NavigationProgress";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer";
import ConfirmDialog from "../components/ConfirmDialog";
import { useLogout } from "../hooks/useLogout";
import SEO from "@/components/SEO";
import MainContainer from "@/components/MainContainer";

export default function UserLayout() {
  const { user } = useLoaderData();
  const location = useLocation();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { handleLogout: logout, isLoggingOut } = useLogout();

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <SEO title="Account" canonicalPath={location.pathname} noindex nofollow />
      <ScrollToTop />
      <NavigationProgress />

      <Navbar
        role={user.role}
        userName={user.username}
        avatar={user.avatar_url}
        onLogout={() => setShowLogoutConfirm(true)}
      />

      <MainContainer>
        <Outlet />
      </MainContainer>

      <Footer />

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Log Out"
        message="You will be signed out of your account. Any unsaved changes may be lost."
        confirmText="Log Out"
        cancelText="Cancel"
        variant="warning"
        isLoading={isLoggingOut}
        loadingText="Logging out"
        showLoadingDots={false}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
