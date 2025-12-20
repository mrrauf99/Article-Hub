import { useMemo } from "react";
import ArticleCard from "./ArticleCard";
import Pagination from "./Pagination";

const PER_PAGE = 9;

export default function ArticlesSection({
  articles,
  title,
  page,
  onPageChange,
  showCreateButton = false,
  createLabel = "+ Create New Article",
  mode = "guest",
}) {
  const totalPages = Math.ceil(articles.length / PER_PAGE);

  const paginatedArticles = useMemo(() => {
    const start = (page - 1) * PER_PAGE;
    return articles.slice(start, start + PER_PAGE);
  }, [articles, page]);

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

        {showCreateButton && (
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md">
            {createLabel}
          </button>
        )}
      </div>

      {/* Articles */}
      {paginatedArticles.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          No articles found.
        </div>
      ) : (
        <>
          <section className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {paginatedArticles.map((a) => (
              <ArticleCard key={a.article_id} article={a} mode={mode} />
            ))}
          </section>

          {totalPages > 1 && (
            <Pagination
              current={page}
              total={totalPages}
              onChange={onPageChange}
            />
          )}
        </>
      )}
    </>
  );
}
