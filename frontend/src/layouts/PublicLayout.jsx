import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";

import ScrollToTop from "@/components/ScrollToTop";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import ConfirmDialog from "@/components/ConfirmDialog";
import { authApi } from "@/features/api/authApi";

export default function PublicLayout() {
  const data = useLoaderData();
  const user = data?.user || null;
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
        role={user?.role || "guest"}
        userName={user?.username}
        avatar={user?.avatar}
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
