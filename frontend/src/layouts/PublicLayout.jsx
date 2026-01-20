import { Outlet, useLoaderData } from "react-router-dom";
import { useState } from "react";

import ScrollToTop from "@/components/ScrollToTop";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useLogout } from "@/hooks/useLogout";

/**
 * Layout for public pages (About, Contact, Terms, Privacy, etc.)
 * Shows authenticated navbar (user/admin) if logged in, guest navbar otherwise
 * This follows industry standard - authenticated users keep their session context
 */
export default function PublicLayout() {
  const data = useLoaderData();
  const user = data?.user || null;

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { handleLogout: logout, isLoggingOut } = useLogout();

  const handleLogout = async () => {
    await logout();
    setShowLogoutConfirm(false);
  };

  return (
    <>
      <ScrollToTop />
      <Navbar
        role={user?.role || "guest"}
        userName={user?.username}
        avatar={user?.avatar_url}
        onLogout={user ? () => setShowLogoutConfirm(true) : undefined}
      />
      <main className="w-full min-h-screen overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />

      {user && (
        <ConfirmDialog
          isOpen={showLogoutConfirm}
          title="Log Out"
          message="Are you sure you want to log out of your account?"
          confirmText="Log Out"
          cancelText="Cancel"
          variant="warning"
          isLoading={isLoggingOut}
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutConfirm(false)}
        />
      )}
    </>
  );
}
