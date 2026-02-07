import { Link } from "react-router-dom";
import { useMemo } from "react";
import { FileX, Layers } from "lucide-react";
import ArticleCard from "./ArticleCard";
import Pagination from "./Pagination";
import StatusFilter from "./StatusFilter";
import { ScrollReveal, StaggerReveal } from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";
import ArticlesList from "@/components/ArticlesList";
import ArticlesEmptyState from "@/components/ArticlesEmptyState";

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
  showPagination = true,
  onDelete,
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
    <>
      <section className="p-4 sm:p-6">
        {/* Header */}
        <ScrollReveal animation="fade-up" duration={500}>
          <div className="mb-6">
            <SectionHeader
              title={title}
              subtitle={`${filteredByStatus.length} article${
                filteredByStatus.length !== 1 ? "s" : ""
              } found`}
              icon={Layers}
              actions={
                <>
                  {showStatusFilter && onStatusChange && (
                    <StatusFilter
                      value={statusFilter}
                      onChange={onStatusChange}
                    />
                  )}

                  {showCreateButton && (
                    <Link
                      to={onCreate}
                      className="inline-flex items-center gap-2 
                      bg-gradient-to-br from-indigo-500 to-indigo-600 
                      hover:from-indigo-600 hover:to-indigo-700 
                      text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-sm sm:text-base font-medium 
                      shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30
                      hover:-translate-y-0.5
                      transition-all duration-300 ease-out
                      focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:ring-offset-2"
                    >
                      <span className="text-lg leading-none">+</span>
                      <span className="hidden sm:inline">Create Article</span>
                      <span className="sm:hidden">Create</span>
                    </Link>
                  )}
                </>
              }
            />
          </div>
        </ScrollReveal>

        {/* Content */}
        <ArticlesList
          items={paginatedArticles}
          renderItem={(article) => (
            <ArticleCard
              key={article.article_id}
              article={article}
              mode={mode}
              onDelete={onDelete}
            />
          )}
          emptyState={
            <ScrollReveal animation="fade" duration={500}>
              <ArticlesEmptyState
                icon={
                  <FileX className="w-8 h-8 sm:w-9 sm:h-9 text-slate-400" />
                }
                title={
                  showStatusFilter && statusFilter !== "all"
                    ? `No ${statusFilter} articles found.`
                    : "No articles found."
                }
                subtitle={
                  showStatusFilter && statusFilter !== "all"
                    ? "Try selecting a different filter."
                    : "Start by creating your first article."
                }
              />
            </ScrollReveal>
          }
          container={StaggerReveal}
          containerProps={{
            staggerDelay: 80,
            animation: "fade-up",
          }}
          className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        />
      </section>

      {/* Pagination - Outside Section */}
      {showPagination && totalPages > 1 && paginatedArticles.length > 0 && (
        <ScrollReveal animation="fade-up" duration={400}>
          <div className="px-4 sm:px-6 mt-10">
            <Pagination
              current={safePage}
              total={totalPages}
              onChange={onPageChange}
            />
          </div>
        </ScrollReveal>
      )}
    </>
  );
}
