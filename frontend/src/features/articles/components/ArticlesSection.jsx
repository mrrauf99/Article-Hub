import { Link } from "react-router-dom";
import { useMemo } from "react";
import { FileX, Layers } from "lucide-react";
import ArticleCard from "./ArticleCard";
import Pagination from "./Pagination";
import StatusFilter from "./StatusFilter";
import { ScrollReveal, StaggerReveal } from "@/components/ScrollReveal";

const PER_PAGE = 9;

export default function ArticlesSection({
  articles,
  title,
  page,
  onPageChange,
  mode,
  showCreateButton,
  onCreate,
  statusFilter = "all",
  onStatusChange,
  showStatusFilter = false,
}) {
  // Filter articles by status
  const filteredByStatus = useMemo(() => {
    if (!showStatusFilter || statusFilter === "all") return articles;
    return articles.filter((a) => a.status === statusFilter);
  }, [articles, statusFilter, showStatusFilter]);

  const totalPages = Math.ceil(filteredByStatus.length / PER_PAGE);

  const safePage = Math.min(Math.max(page, 1), totalPages || 1);

  const paginatedArticles = useMemo(() => {
    const start = (safePage - 1) * PER_PAGE;
    return filteredByStatus.slice(start, start + PER_PAGE);
  }, [filteredByStatus, safePage]);

  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      {/* Header */}
      <ScrollReveal animation="fade-up" duration={500}>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg shadow-indigo-500/25">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-500">
                {filteredByStatus.length} article
                {filteredByStatus.length !== 1 ? "s" : ""} found
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Status Filter */}
            {showStatusFilter && onStatusChange && (
              <StatusFilter value={statusFilter} onChange={onStatusChange} />
            )}

            {/* Create Button */}
            {showCreateButton && (
              <Link
                to={onCreate}
                className="inline-flex items-center gap-2 
                bg-gradient-to-br from-indigo-500 to-indigo-600 
                hover:from-indigo-600 hover:to-indigo-700 
                text-white px-5 py-2.5 rounded-full font-medium 
                shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30
                hover:-translate-y-0.5
                transition-all duration-300 ease-out
                focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2"
              >
                <span className="text-lg leading-none">+</span>
                Create Article
              </Link>
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Content */}
      {paginatedArticles.length === 0 ? (
        <ScrollReveal animation="fade" duration={500}>
          <div className="py-24 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 mb-5">
              <FileX className="w-9 h-9 text-slate-400" />
            </div>
            <p className="text-slate-500 text-lg font-medium">
              {showStatusFilter && statusFilter !== "all"
                ? `No ${statusFilter} articles found.`
                : "No articles found."}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              {showStatusFilter && statusFilter !== "all"
                ? "Try selecting a different filter."
                : "Start by creating your first article."}
            </p>
          </div>
        </ScrollReveal>
      ) : (
        <>
          <StaggerReveal staggerDelay={80} animation="fade-up">
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {paginatedArticles.map((article) => (
                <ArticleCard
                  key={article.article_id}
                  article={article}
                  mode={mode}
                />
              ))}
            </div>
          </StaggerReveal>

          {totalPages > 1 && (
            <ScrollReveal animation="fade-up" duration={400}>
              <Pagination
                current={safePage}
                total={totalPages}
                onChange={onPageChange}
              />
            </ScrollReveal>
          )}
        </>
      )}
    </section>
  );
}
