import { Outlet, useLoaderData } from "react-router-dom";
import { authApi } from "../features/api/authApi.js";

import ScrollToTop from "../components/ScrollToTop";
import Navbar from "../components/navbar/Navbar.jsx";
import Footer from "../components/Footer";

export default function UserLayout() {
  const { user } = useLoaderData();

  return (
    <>
      <ScrollToTop />

      <Navbar
        role={user.role}
        userName={user.username}
        onLogout={authApi.logout}
      />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Outlet />
      </main>

      <Footer />
    </>
  );
}
