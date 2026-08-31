import { useMemo } from "react";
import { Layers } from "lucide-react";
import ArticleCard from "@/features/articles/components/ArticleCard";
import Pagination from "@/features/articles/components/Pagination";
import CategoryFilter from "@/components/CategoryFilter";
import SectionHeader from "@/components/SectionHeader";
import { ScrollReveal } from "@/components/ScrollReveal";
import ArticlesList from "@/components/ArticlesList";
import ArticlesEmptyState from "@/components/ArticlesEmptyState";
import useScrollOnChange from "@/hooks/useScrollOnChange";

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

  const primaryCategories = useMemo(() => categories.slice(0, 9), [categories]);
  const overflowCategories = useMemo(() => categories.slice(9), [categories]);
  const overflowActive = overflowCategories.includes(activeCategory);

  return (
    <section
      id="articles"
      className="py-14 sm:py-20 bg-paper scroll-mt-16 font-ui"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <SectionHeader
            title={
              activeCategory === "All" ? "All articles" : `${activeCategory} articles`
            }
            subtitle={`${resolvedTotalCount} ${
              resolvedTotalCount === 1 ? "article" : "articles"
            }${activeCategory !== "All" ? ` in ${activeCategory}` : ""}`}
            icon={Layers}
            titleClassName="font-editorial text-2xl sm:text-3xl text-ink"
            subtitleClassName="text-ink-muted text-sm mt-1"
            actions={
              overflowCategories.length > 0 && (
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onChange={onCategorySelect}
                  variant="light"
                  className="lg:hidden w-full sm:w-56"
                />
              )
            }
            actionsClassName="w-full sm:w-auto"
          />
        </div>

        <div className="hidden lg:flex flex-wrap gap-2 mb-10">
          {primaryCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategorySelect(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-ink text-paper"
                  : "bg-paper-raised text-ink-muted border border-hairline hover:border-hairline-strong hover:text-ink"
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
                overflowActive ? activeCategory : `+${overflowCategories.length} more`
              }
              moreButtonActive={overflowActive}
            />
          )}
        </div>

        <ArticlesList
          items={articles}
          renderItem={(article, index) => (
            <ScrollReveal
              key={`${article.id}-${safePage}`}
              animation="fade-up"
              delay={index * 50}
              duration={350}
            >
              <ArticleCard article={article} mode="guest" basePath="/articles" />
            </ScrollReveal>
          )}
          emptyState={
            <ScrollReveal animation="fade-up">
              <ArticlesEmptyState
                icon={
                  <svg
                    className="w-9 h-9 text-ink-faint"
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
                subtitle="Try a different category, or check back later."
                containerClassName="py-20 text-center font-ui"
                iconWrapperClassName="inline-flex items-center justify-center w-16 h-16 rounded-full bg-paper-raised border border-hairline mb-5"
                titleClassName="text-lg font-semibold text-ink mb-1.5"
                subtitleClassName="text-ink-faint text-sm"
              />
            </ScrollReveal>
          }
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
        />

        {totalPages > 1 && articles.length > 0 && (
          <div className="mt-10">
            <Pagination current={safePage} total={totalPages} onChange={onPageChange} />
          </div>
        )}
      </div>
    </section>
  );
}
