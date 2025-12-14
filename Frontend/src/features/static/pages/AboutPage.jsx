import React from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer";
import AboutContent from "../components/AboutContent";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar userRole="guest" />
      <main className="flex-1 py-8">
        <AboutContent />
      </main>
      <Footer />
    </div>
  );
}
