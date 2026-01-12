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
import { normalizeCategory, getCanonicalCategory } from "@/utils/categoryUtils";

export default function HomePage() {
  const { articles } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawCategory = searchParams.get("category");
  const pageParam = Number(searchParams.get("page")) || 1;

  const activeCategory = useMemo(() => {
    if (!rawCategory) return "All";
    const canonical = getCanonicalCategory(rawCategory);
    return canonical || "All";
  }, [rawCategory]);

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") return articles;
    return articles.filter((a) => {
      const articleCategory = normalizeCategory(a.category);
      return articleCategory === activeCategory;
    });
  }, [articles, activeCategory]);

  const articleCounts = useMemo(() => {
    const counts = {};
    articles.forEach((article) => {
      const normalized = normalizeCategory(article.category);
      counts[normalized] = (counts[normalized] || 0) + 1;
    });
    return counts;
  }, [articles]);

  const categories = useMemo(() => {
    const ranked = Object.entries(articleCounts)
      .filter(([, count]) => count > 0)
      .sort((a, b) => b[1] - a[1])
      .map(([name]) => name)
      .filter((cat) => ARTICLE_CATEGORIES.includes(cat));

    const remaining = ARTICLE_CATEGORIES.filter(
      (category) => !ranked.includes(category)
    );

    return ["All", ...ranked, ...remaining];
  }, [articleCounts]);

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
