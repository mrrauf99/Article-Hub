import { useMemo } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";

import Layout from "../components/Layout";
import Sidebar from "../components/Sidebar";
import ArticlesSection from "@/features/articles/components/ArticlesSection";
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

  const categories = useMemo(() => ["All", ...ARTICLE_CATEGORIES], []);

  const filteredArticles = useMemo(() => {
    if (activeCategory === "All") return articles;
    return articles.filter((a) => a.category === activeCategory);
  }, [articles, activeCategory]);

  function handleCategorySelect(category) {
    const params = new URLSearchParams(searchParams);

    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }

    params.set("page", "1");
    setSearchParams(params);
  }

  function handlePageChange(page) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
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
        showCreateButton={false}
        mode="guest"
        title={
          activeCategory === "All"
            ? "All Articles"
            : `${activeCategory} Articles`
        }
      />
    </Layout>
  );
}
