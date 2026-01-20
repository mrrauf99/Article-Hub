import { useState } from "react";
import { Outlet, useLoaderData } from "react-router-dom";

import ScrollToTop from "../components/ScrollToTop";
import Navbar from "../components/Navbar/Navbar.jsx";
import Footer from "../components/Footer";
import ConfirmDialog from "../components/ConfirmDialog";
import { useLogout } from "../hooks/useLogout";

export default function AdminLayout() {
  const { user } = useLoaderData();
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
        role={user.role}
        userName={user.username}
        avatar={user.avatar_url}
        onLogout={() => setShowLogoutConfirm(true)}
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
        message="Are you sure you want to log out of your account?"
        confirmText="Log Out"
        cancelText="Cancel"
        variant="warning"
        isLoading={isLoggingOut}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </>
  );
}
