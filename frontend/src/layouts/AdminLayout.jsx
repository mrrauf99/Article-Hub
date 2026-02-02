import { useState, useEffect } from "react";
import { Outlet, useLoaderData, useRevalidator } from "react-router-dom";

import ScrollToTop from "../components/ScrollToTop";
import NavigationProgress from "../components/NavigationProgress";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer";
import ConfirmDialog from "../components/ConfirmDialog";
import { useLogout } from "../hooks/useLogout";

const POLLING_INTERVAL = 45000; // 45 seconds

export default function AdminLayout() {
  const { user, pendingCount = 0 } = useLoaderData();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { handleLogout: logout, isLoggingOut } = useLogout();
  const revalidator = useRevalidator();

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };

  // Poll for pending articles updates
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Only revalidate if not already revalidating
      if (revalidator.state === "idle") {
        revalidator.revalidate();
      }
    }, POLLING_INTERVAL);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, [revalidator]);

  return (
    <>
      <ScrollToTop />
      <NavigationProgress />

      <Navbar
        role={user.role}
        userName={user.username}
        avatar={user.avatar_url}
        onLogout={() => setShowLogoutConfirm(true)}
        pendingCount={pendingCount}
      />

      <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto">
          <Outlet context={{ user }} />
        </div>
      </main>

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
