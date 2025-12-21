import { Outlet } from "react-router-dom";

import ScrollToTop from "@/components/ScrollToTop";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";

export default function PublicLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="min-h-screen bg-slate-50">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
