import { useState, useMemo } from "react";
import Navbar from "../../../components/Navbar/Navbar";
import Footer from "../../../components/Footer";
import GuestLayout from "../components/GuestLayout";
import GuestSidebar from "../components/GuestSidebar";
import ArticlesSection from "../../../components/ArticlesSection";
import { initialArticles } from "../../user_panel/utility/articles";

export default function GuestPanel() {
  // Only approved articles
  const approvedArticles = useMemo(
    () => initialArticles.filter(a => a.status === "approved"),
    []
  );

  // Active category state
  const [activeCategory, setActiveCategory] = useState("All");

  // Categories list
  const categories = useMemo(
    () => ["All", ...new Set(approvedArticles.map(a => a.category))],
    [approvedArticles]
  );

  // FILTERED ARTICLES (THIS DRIVES THE CARDS)
  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") return approvedArticles;
    return approvedArticles.filter(
      article => article.category === activeCategory
    );
  }, [activeCategory, approvedArticles]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userRole="guest" />

      <GuestLayout
        sidebar={
          <GuestSidebar
            categories={categories}
            active={activeCategory}
            onSelect={setActiveCategory}
          />
        }
      >
        {/* Cards update automatically when filteredArticles changes */}
        <ArticlesSection
          initialArticles={filteredArticles}
          mode="guest"
          title={
            activeCategory === "All"
              ? "All Articles"
              : `Articles · ${activeCategory}`
          }
          showCreateButton={false}
        />
      </GuestLayout>

      <Footer />
    </div>
  );
}
