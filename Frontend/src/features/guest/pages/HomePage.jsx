import { useMemo } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";

import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import ArticlesSection from "@/features/articles/components/ArticlesSection";

import { ARTICLE_CATEGORIES } from "@/data/articleCategories";

export default function HomePage() {
  const articles = useLoaderData();

  const [searchParams, setSearchParams] = useSearchParams();

  const rawCategory = searchParams.get("category");
  const pageParam = Number(searchParams.get("page")) || 1;

  const activeCategory =
    rawCategory && ARTICLE_CATEGORIES.includes(rawCategory)
      ? rawCategory
      : "All";

  const categories = ["All", ...ARTICLE_CATEGORIES];

  // Filter by category
  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

  // When category changes → reset page to 1
  function handleCategorySelect(category) {
    if (category === "All") {
      setSearchParams({ page: "1" });
    } else {
      setSearchParams({ category, page: "1" });
    }
  }

  // Page change handler
  function handlePageChange(page) {
    const params = {};

    if (activeCategory !== "All") {
      params.category = activeCategory;
    }

    params.page = String(page);
    setSearchParams(params);
  }

  return (
    <Layout
      sidebar={
        <Sidebar
          categories={categories}
          active={activeCategory}
          onSelect={handleCategorySelect}
        />
      }
    >
      <ArticlesSection
        articles={filteredArticles}
        page={pageParam}
        onPageChange={handlePageChange}
        title={
          activeCategory === "All"
            ? "All Articles"
            : `${activeCategory} Articles`
        }
      />
    </Layout>
  );
}
