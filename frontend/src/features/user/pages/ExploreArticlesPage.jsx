import { useMemo, useEffect, useRef } from "react";
import {
  useLoaderData,
  useRouteLoaderData,
  useSearchParams,
} from "react-router-dom";
import { SearchX } from "lucide-react";

import Pagination from "@/features/articles/components/Pagination";
import CategoryFilter from "@/components/CategoryFilter";
import SEO from "@/components/SEO";
import { BTN_SECONDARY, FOCUS, LINK } from "@/styles/panelClasses";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import SearchField from "../components/SearchField";
import ExploreItem from "../components/ExploreItem";
import { ARTICLE_CATEGORIES } from "@/data/articleCategories";
import { normalizeCategory, getCanonicalCategory } from "@/utils/categoryUtils";

const PER_PAGE = 9;

export default function ExploreArticlesPage() {
  const { articles } = useLoaderData();
  const userLayoutData = useRouteLoaderData("user-layout");
  const userId = userLayoutData?.user?.id ?? null;
  const [searchParams, setSearchParams] = useSearchParams();

  const rawCategory = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const pageParam = Number(searchParams.get("page")) || 1;

  const activeCategory = useMemo(() => {
    if (!rawCategory) return "All";
    const canonical = getCanonicalCategory(rawCategory);
    return canonical || "All";
  }, [rawCategory]);

  const categories = useMemo(() => ["All", ...ARTICLE_CATEGORIES], []);
  const overflowCategories = useMemo(() => categories.slice(10), [categories]);
  const overflowActive = overflowCategories.includes(activeCategory);

  const filteredArticles = useMemo(() => {
    let result = articles;

    if (userId) {
      result = result.filter((article) => article.author_id !== userId);
    }

    if (activeCategory !== "All") {
      result = result.filter((a) => {
        const articleCategory = normalizeCategory(a.category);
        return articleCategory === activeCategory;
      });
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.summary?.toLowerCase().includes(query) ||
          a.author_name?.toLowerCase().includes(query),
      );
    }

    return result;
  }, [articles, activeCategory, searchQuery, userId]);

  const totalPages = Math.ceil(filteredArticles.length / PER_PAGE);
  const safePage = Math.min(Math.max(pageParam, 1), totalPages || 1);

  const paginatedArticles = useMemo(() => {
    const start = (safePage - 1) * PER_PAGE;
    return filteredArticles.slice(start, start + PER_PAGE);
  }, [filteredArticles, safePage]);

  function handleCategoryChange(category) {
    const params = new URLSearchParams(searchParams);
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    params.set("page", "1");
    setSearchParams(params, { preventScrollReset: true });
  }

  function handleSearch(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search")?.toString().trim() || "";

    const params = new URLSearchParams(searchParams);
    if (query) {
      params.set("search", query);
    } else {
      params.delete("search");
    }
    params.set("page", "1");
    setSearchParams(params, { preventScrollReset: true });
  }

  const prevPageRef = useRef(safePage);
  const prevCategoryRef = useRef(activeCategory);
  const prevSearchRef = useRef(searchQuery);

  function handlePageChange(page) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params, { preventScrollReset: true });
  }

  useEffect(() => {
    const pageChanged = prevPageRef.current !== safePage;
    const categoryChanged = prevCategoryRef.current !== activeCategory;
    const searchChanged = prevSearchRef.current !== searchQuery;

    if (pageChanged || categoryChanged || searchChanged) {
      const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      };

      const timeoutId = setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(scrollToTop);
        });
      }, 100);

      prevPageRef.current = safePage;
      prevCategoryRef.current = activeCategory;
      prevSearchRef.current = searchQuery;

      return () => clearTimeout(timeoutId);
    }
  }, [safePage, activeCategory, searchQuery]);

  const isFiltered = activeCategory !== "All" || Boolean(searchQuery);

  function clearFilters() {
    setSearchParams(new URLSearchParams(), { preventScrollReset: true });
  }

  return (
    <div>
      <SEO title="Explore" canonicalPath="/user/articles" noindex nofollow />

      <PageHeader
        title={activeCategory === "All" ? "Explore" : activeCategory}
        description={
          <>
            <span className="font-semibold tabular-nums text-ink">
              {filteredArticles.length}
            </span>{" "}
            {filteredArticles.length === 1 ? "article" : "articles"}
            {activeCategory !== "All" && <> in {activeCategory}</>}
            {searchQuery && <> matching &ldquo;{searchQuery}&rdquo;</>} from other
            writers. Your own articles live on your dashboard.
          </>
        }
      />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <form onSubmit={handleSearch} role="search" className="sm:w-80">
          <SearchField
            key={searchQuery}
            id="explore-search"
            label="Search articles"
            name="search"
            defaultValue={searchQuery}
            placeholder="Search by title, summary, or author"
          />
        </form>

        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onChange={handleCategoryChange}
          variant="light"
          className="sm:w-56 lg:hidden"
        />

        {isFiltered && (
          <button type="button" onClick={clearFilters} className={`${LINK} text-sm sm:ml-2`}>
            Clear filters
          </button>
        )}
      </div>

      <div className="mt-5 hidden flex-wrap items-center gap-2 lg:flex">
        {categories.slice(0, 10).map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => handleCategoryChange(category)}
              className={`h-9 rounded-full px-4 text-sm font-medium transition-colors duration-150 ${FOCUS} ${
                isActive
                  ? "bg-ink text-paper"
                  : "border border-hairline bg-paper-raised text-ink-muted hover:border-hairline-strong hover:text-ink"
              }`}
            >
              {category}
            </button>
          );
        })}
        {overflowCategories.length > 0 && (
          <CategoryFilter
            categories={overflowCategories}
            activeCategory={activeCategory}
            onChange={handleCategoryChange}
            variant="light"
            triggerLabel={
              overflowActive ? activeCategory : `+${overflowCategories.length} more`
            }
            moreButtonActive={overflowActive}
          />
        )}
      </div>

      <div className="mt-8 border-t border-hairline pt-8">
        {paginatedArticles.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No articles found"
            action={
              isFiltered && (
                <button type="button" onClick={clearFilters} className={BTN_SECONDARY}>
                  Clear filters
                </button>
              )
            }
          >
            {isFiltered
              ? "Nothing matches this search or category. Try another word or a broader category."
              : "No other writers have published yet. Check back soon."}
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedArticles.map((article) => (
              <ExploreItem key={article.id} article={article} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-10">
            <Pagination current={safePage} total={totalPages} onChange={handlePageChange} />
          </div>
        )}
      </div>
    </div>
  );
}
