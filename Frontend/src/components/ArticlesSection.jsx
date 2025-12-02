// src/components/ArticlesSection.jsx
import { useState } from "react";
import ArticleCard from "./ArticleCard";

export default function ArticlesSection({
  initialArticles = [],
  mode = "user", // "guest" | "user" | "admin"
  title = "Articles",
  showCreateButton = false,
  createLabel = "+ Create New Article",
  onCreate = () => {},
  filterFn, // optional (article) => boolean
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [expandedId, setExpandedId] = useState(null);

  const handleToggle = (id) => {
    setExpandedId((current) => (current === id ? null : id));
  };

  const handleViewIncrease = (id) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, views: (a.views ?? 0) + 1 } : a))
    );
  };

  const handleLikeIncrease = (id) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === id ? { ...a, likes: (a.likes ?? 0) + 1 } : a))
    );
  };

  const handleUpdate = (updatedArticle) => {
    setArticles((prev) =>
      prev.map((a) => (a.id === updatedArticle.id ? updatedArticle : a))
    );
  };

  const handleDelete = (id) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const visibleArticles =
    typeof filterFn === "function" ? articles.filter(filterFn) : articles;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

        {showCreateButton && (
          <button
            type="button"
            onClick={onCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            {createLabel}
          </button>
        )}
      </div>

      <section className="masonry-grid">
        {visibleArticles.map((article) => (
          <div key={article.id} className="masonry-item">
            <ArticleCard
              article={article}
              mode={mode}
              isExpanded={expandedId === article.id}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
              onDelete={handleDelete}
              onView={handleViewIncrease}
              onLike={handleLikeIncrease}
            />
          </div>
        ))}
      </section>
    </>
  );
}
