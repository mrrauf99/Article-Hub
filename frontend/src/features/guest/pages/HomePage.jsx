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
  const { articles, pagination, meta } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawCategory = searchParams.get("category");
  const pageParam = Number(searchParams.get("page")) || 1;

  const activeCategory = useMemo(() => {
    if (!rawCategory) return "All";
    const canonical = getCanonicalCategory(rawCategory);
    return canonical || "All";
  }, [rawCategory]);

  const articleCounts = useMemo(() => {
    const counts = {};
    (meta?.categoryCounts || []).forEach(({ category, count }) => {
      const normalized = normalizeCategory(category);
      counts[normalized] = count;
    });
    return counts;
  }, [meta?.categoryCounts]);

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

  const authorCount = meta?.authorCount ?? 0;
  const totalArticles = meta?.overallCount ?? articles.length;

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
      <HeroSection articleCount={totalArticles} authorCount={authorCount} />

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
        articles={articles}
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        page={pageParam}
        onPageChange={handlePageChange}
        totalCount={pagination?.totalCount ?? articles.length}
        totalPages={pagination?.totalPages ?? 1}
      />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* CTA Section */}
      <CTASection />
    </div>
  );
}
