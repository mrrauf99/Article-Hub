import { useMemo } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";

import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import GuestLayout from "../components/GuestLayout";
import GuestSidebar from "../components/GuestSidebar";
import ArticlesSection from "@/features/articles/components/ArticlesSection";

import { ARTICLE_CATEGORIES } from "@/utils/articleCategories";

export default function GuestPanel() {
  const articles = useLoaderData();

  const [searchParams, setSearchParams] = useSearchParams();
  const rawCategory = searchParams.get("category");

  // Validate category from URL
  const activeCategory =
    rawCategory && ARTICLE_CATEGORIES.includes(rawCategory)
      ? rawCategory
      : "All";

  // Sidebar categories
  const categories = ["All", ...ARTICLE_CATEGORIES];

  // Filtered articles
  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") return articles;
    return articles.filter((article) => article.category === activeCategory);
  }, [articles, activeCategory]);

  function handleCategorySelect(category) {
    if (category === "All") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar userRole="guest" />

      <GuestLayout
        sidebar={
          <GuestSidebar
            categories={categories}
            active={activeCategory}
            onSelect={handleCategorySelect}
          />
        }
      >
        <ArticlesSection
          articles={filteredArticles}
          title={
            activeCategory === "All"
              ? "All Articles"
              : `${activeCategory} Articles`
          }
        />
      </GuestLayout>

      <Footer />
    </div>
  );
}
