import { useState, useEffect } from "react";
import ArticleCard from "./ArticleCard";

export default function ArticlesSection({
  initialArticles = [],
  title = "Articles",
  showCreateButton = false,
  createLabel = "+ Create New Article",
  onCreate = () => {},
  filterFn,
}) {
  const [articles, setArticles] = useState(initialArticles);

  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  const visibleArticles =
    typeof filterFn === "function" ? articles.filter(filterFn) : articles;

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

        {showCreateButton && (
          <button
            onClick={onCreate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md"
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
              onEdit={(id) => navigate(`/articles/edit/${id}`)}
              onDelete={(id) =>
                setArticles((prev) => prev.filter((a) => a.id !== id))
              }
            />
          </div>
        ))}
      </section>
    </>
  );
}
