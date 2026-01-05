import { useMemo } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";

import HeroSection from "../components/HeroSection";
import FeaturedArticles from "../components/FeaturedArticles";
import CategoriesSection from "../components/CategoriesSection";
import FeaturesSection from "../components/FeaturesSection";
import CTASection from "../components/CTASection";
import ArticlesGrid from "../components/ArticlesGrid";
import NewsletterSection from "../components/NewsletterSection";
import { ARTICLE_CATEGORIES } from "@/data/articleCategories";

export default function HomePage() {
  const { articles } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawCategory = searchParams.get("category");
  const pageParam = Number(searchParams.get("page")) || 1;

  const activeCategory = useMemo(() => {
    return rawCategory && ARTICLE_CATEGORIES.includes(rawCategory)
      ? rawCategory
      : "All";
  }, [rawCategory]);

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

  // Calculate article counts per category
  const articleCounts = useMemo(() => {
    const counts = {};
    articles.forEach((article) => {
      counts[article.category] = (counts[article.category] || 0) + 1;
    });
    return counts;
  }, [articles]);

  // Build category list sorted by popularity and excluding empty ones
  const categories = useMemo(() => {
    const entries = Object.entries(articleCounts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name);

    // Fallback to all configured categories if we have no data yet
    const base = entries.length > 0 ? entries : ARTICLE_CATEGORIES;
    return ["All", ...base];
  }, [articleCounts]);

  // Get unique authors count
  const authorCount = useMemo(() => {
    const authors = new Set(articles.map((a) => a.author_name));
    return authors.size;
  }, [articles]);

  function handleCategorySelect(category) {
    const params = new URLSearchParams(searchParams);

    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    params.set("page", "1");
    setSearchParams(params, { preventScrollReset: true });
  }

  function handlePageChange(page) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params, { preventScrollReset: true });
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection articleCount={articles.length} authorCount={authorCount} />

      {/* Featured Articles */}
      <FeaturedArticles articles={articles} />

      {/* Categories Section */}
      <CategoriesSection
        categories={categories}
        onSelect={handleCategorySelect}
        articleCounts={articleCounts}
      />

      {/* Features Section */}
      <FeaturesSection />

      {/* All Articles Grid */}
      <ArticlesGrid
        articles={filteredArticles}
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        page={pageParam}
        onPageChange={handlePageChange}
      />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
