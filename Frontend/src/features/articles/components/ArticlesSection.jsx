import ArticleCard from "./ArticleCard";

export default function ArticlesSection({
  articles,
  title,
  showCreateButton = false,
  createLabel = "+ Create New Article",
  mode = "guest",
}) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>

        {showCreateButton && (
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-md">
            {createLabel}
          </button>
        )}
      </div>

      {articles.length === 0 ? (
        <div className="py-20 text-center text-gray-500">
          No articles found.
        </div>
      ) : (
        <section className="masonry-grid">
          {articles.map((a) => (
            <div key={a.article_id} className="masonry-item">
              <ArticleCard article={a} mode={mode} />
            </div>
          ))}
        </section>
      )}
    </>
  );
}
