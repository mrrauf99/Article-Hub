import { useState } from "react";
import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { authApi } from "../features/api/authApi.js";

import ScrollToTop from "../components/ScrollToTop";
import Navbar from "../components/navbar/Navbar.jsx";
import Footer from "../components/Footer";
import ConfirmDialog from "../components/ConfirmDialog";

export default function AdminLayout() {
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await authApi.logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      navigate("/login", { replace: true });
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  return (
    <>
      <ScrollToTop />

      <Navbar
        role={user.role}
        userName={user.username}
        avatar={user.avatar}
        onLogout={() => setShowLogoutConfirm(true)}
      />

      <main className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 overflow-x-hidden">
        <div className="w-full max-w-7xl mx-auto">
          <Outlet />
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
