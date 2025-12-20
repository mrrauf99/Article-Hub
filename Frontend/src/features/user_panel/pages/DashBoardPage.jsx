// src/features/user_panel/pages/DashBoard.jsx
import { useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer";
import Main from "../components/dashbord/Main";
import { initialArticles } from "../utility/articles";

const handleLogout = () => alert("Logged out");

export default function DashBoard() {
  const [articles] = useState(initialArticles);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="user" userName="Tayyab" onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <Main initialArticles={articles} />
      </main>

      <Footer />
    </div>
  );
}
