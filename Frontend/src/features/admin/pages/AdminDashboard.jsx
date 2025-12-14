import { useState } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer";
import AdminDashboardStats from "../components/AdminDashboardStats";
import AdminArticlesSection from "../components/AdminArticlesSection";
import { initialArticles as seedArticles } from "../../user_panel/utility/articles";

export default function AdminDashboard() {
  const [articles, setArticles] = useState(seedArticles);

  const handleArticleStatusChange = (id, newStatus) => {
    setArticles(prev =>
      prev.map(a => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleArticleDelete = (id) => {
    setArticles(prev => prev.filter(a => a.id !== id));
  };

  const handleLogout = () => {
    alert("Admin logged out");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="admin" userName="Admin" onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <AdminDashboardStats articles={articles} />

        <AdminArticlesSection
          articles={articles}
          onChangeStatus={handleArticleStatusChange}
          onDelete={handleArticleDelete}
        />
      </main>

      <Footer />
    </div>
  );
}
