import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Eye, Clock } from "lucide-react";
import Pagination from "@/features/articles/components/Pagination";
import CategoryFilter from "@/components/CategoryFilter";
import { ScrollReveal } from "@/components/ScrollReveal";
import SectionHeader from "@/components/SectionHeader";
import ArticlesList from "@/components/ArticlesList";
import ArticlesEmptyState from "@/components/ArticlesEmptyState";
import useScrollOnChange from "@/hooks/useScrollOnChange";
import formatCount from "@/utils/formatCount";

export default function ArticlesGrid({
  articles,
  categories,
  activeCategory,
  onCategorySelect,
  page,
  onPageChange,
  totalCount,
  totalPages,
}) {
  const safePage = Math.min(Math.max(page, 1), totalPages || 1);
  const resolvedTotalCount = totalCount ?? articles.length;

  useScrollOnChange({
    deps: [safePage, activeCategory],
    behavior: "smooth",
    offset: 20,
    delay: 100,
    getTarget: () => document.getElementById("articles"),
    shouldScroll: ({ prev, next }) => {
      const [, prevCategory] = prev;
      const [, nextCategory] = next;
      const categoryChanged = prevCategory !== nextCategory;
      const target = document.getElementById("articles");
      if (!target) return false;
      const rect = target.getBoundingClientRect();
      return rect.height > 0 || categoryChanged;
    },
  });

  const primaryCategories = useMemo(
    () => categories.slice(0, 10),
    [categories],
  );
  const overflowCategories = useMemo(() => categories.slice(10), [categories]);
  const overflowActive = overflowCategories.includes(activeCategory);

  return (
    <section
      id="articles"
      className="py-12 sm:py-16 lg:py-24 bg-slate-50 scroll-mt-20 w-full"
    >
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="mb-10">
            <SectionHeader
              title={
                activeCategory === "All"
                  ? "All Articles"
                  : `${activeCategory} Articles`
              }
              subtitle={`Browse ${resolvedTotalCount} ${
                resolvedTotalCount === 1 ? "article" : "articles"
              }${activeCategory !== "All" ? ` in ${activeCategory}` : ""}`}
              titleClassName="text-3xl lg:text-4xl font-bold text-slate-900"
              subtitleClassName="text-slate-600"
              actions={
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onChange={onCategorySelect}
                  variant="light"
                  className="max-w-xs w-full lg:hidden"
                />
              }
              actionsClassName="w-full md:w-auto"
            />
          </div>

          {/* Category Pills (Desktop) */}
          <div className="hidden lg:flex flex-wrap gap-2.5 mb-10">
            {primaryCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => onCategorySelect(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none ${
                  activeCategory === cat
                    ? "bg-sky-600 text-white shadow-md shadow-sky-500/25"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
            {overflowCategories.length > 0 && (
              <CategoryFilter
                categories={overflowCategories}
                activeCategory={activeCategory}
                onChange={onCategorySelect}
                variant="light"
                triggerLabel={
                  overflowActive
                    ? activeCategory
                    : `+${overflowCategories.length} more`
                }
                moreButtonActive={overflowActive}
              />
            )}
          </div>

          {/* Articles Grid */}
          <ArticlesList
            items={articles}
            renderItem={(article, index) => (
              <ScrollReveal
                key={`${article.article_id}-${safePage}`}
                animation="fade-up"
                delay={index * 50}
                duration={350}
              >
                <ArticleCard article={article} />
              </ScrollReveal>
            )}
            emptyState={
              <ScrollReveal animation="fade-up">
                <ArticlesEmptyState
                  icon={
                    <svg
                      className="w-10 h-10 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                      />
                    </svg>
                  }
                  title="No articles found"
                  subtitle="Try selecting a different category or check back later."
                  containerClassName="py-20 text-center"
                  iconWrapperClassName="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-200 mb-5"
                  titleClassName="text-xl font-semibold text-slate-700 mb-2"
                  subtitleClassName="text-slate-500"
                />
              </ScrollReveal>
            }
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          />

          {totalPages > 1 && articles.length > 0 && (
            <div className="mt-10">
              <Pagination
                current={safePage}
                total={totalPages}
                onChange={onPageChange}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article }) {
  return (
    <Link
      to={`/articles/${article.article_id}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      {article.image_url ? (
        <div className="aspect-[16/10] overflow-hidden bg-slate-100">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      ) : (
        <div className="aspect-[16/10] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-slate-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col flex-1 p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-block bg-sky-100 text-sky-700 text-xs font-semibold px-3 py-1 rounded-full">
            {article.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Eye className="w-3.5 h-3.5" />
            {formatCount(article.views)}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 line-clamp-2 mb-2 group-hover:text-sky-600 transition-colors">
          {article.title}
        </h3>

        <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
          {article.summary}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
              {article.author_name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <span className="text-sm font-medium text-slate-700">
              {article.author_name}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            {formatDate(article.published_at)}
          </span>
        </div>
      </div>
    </Link>
  );
}

function formatDate(dateString) {
  if (!dateString) return "Recent";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
