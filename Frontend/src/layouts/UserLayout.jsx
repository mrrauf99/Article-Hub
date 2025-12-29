import { Outlet, useLoaderData, useNavigate } from "react-router-dom";
import { authApi } from "../features/api/authApi.js";

import ScrollToTop from "../components/ScrollToTop";
import Navbar from "../components/navbar/Navbar.jsx";
import Footer from "../components/Footer";

export default function UserLayout() {
  const { user } = useLoaderData();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      // Still navigate to login even if logout API fails
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <ScrollToTop />

      <Navbar
        role={user.role}
        userName={user.username}
        avatar={user.avatar}
        onLogout={handleLogout}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
