import { useMemo } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { Search, Sparkles, BookOpen } from "lucide-react";

import ArticleCard from "@/features/articles/components/ArticleCard";
import Pagination from "@/features/articles/components/Pagination";
import CategoryFilter from "@/components/CategoryFilter";
import { ScrollReveal, StaggerReveal } from "@/components/ScrollReveal";
import { ARTICLE_CATEGORIES } from "@/data/articleCategories";

const PER_PAGE = 9;

export default function ExploreArticlesPage() {
  const { articles } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();

  const rawCategory = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const pageParam = Number(searchParams.get("page")) || 1;

  const activeCategory = useMemo(() => {
    return rawCategory && ARTICLE_CATEGORIES.includes(rawCategory)
      ? rawCategory
      : "All";
  }, [rawCategory]);

  const categories = useMemo(() => ["All", ...ARTICLE_CATEGORIES], []);
  const overflowCategories = useMemo(
    () => categories.slice(10),
    [categories]
  );
  const overflowActive = overflowCategories.includes(activeCategory);

  // Filter by category and search
  const filteredArticles = useMemo(() => {
    let result = articles;

    if (activeCategory !== "All") {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.summary?.toLowerCase().includes(query) ||
          a.author_name?.toLowerCase().includes(query)
      );
    }

    return result;
  }, [articles, activeCategory, searchQuery]);

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

  function handlePageChange(page) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params, { preventScrollReset: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="space-y-6 -mt-8">
      {/* Hero Section Header with Categories - Connected to Navbar */}
      <ScrollReveal animation="fade-up" duration={600}>
        <div
          className="relative p-8 lg:p-10 pb-8 -mx-4 px-8 lg:px-14"
          style={{
            background: "linear-gradient(180deg, #0f172a 0%, #1e293b 100%)",
          }}
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-500/10 to-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-sky-500/8 to-cyan-500/8 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl shadow-lg shadow-sky-500/30">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl lg:text-4xl font-bold text-white">
                    {activeCategory === "All"
                      ? "Explore Articles"
                      : activeCategory}
                  </h2>
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <p className="text-slate-300 text-lg">
                  Discover{" "}
                  <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-400">
                    {filteredArticles.length}
                  </span>{" "}
                  {filteredArticles.length === 1
                    ? "article"
                    : "amazing articles"}
                  {activeCategory !== "All" && (
                    <span className="text-slate-400">
                      {" "}
                      in{" "}
                      <span className="text-white font-medium">
                        {activeCategory}
                      </span>
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Search & Filter */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Box */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search articles..."
                  className="w-full sm:w-72 pl-12 pr-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                />
              </form>

              {/* Category Filter Dropdown - visible on mobile, hidden on lg */}
              <CategoryFilter
                categories={categories}
                activeCategory={activeCategory}
                onChange={handleCategoryChange}
                variant="dark"
                className="lg:hidden"
              />
            </div>
          </div>

          {/* Category Pills - Hidden on mobile, visible on lg+ */}
          <div className="relative hidden lg:flex flex-wrap items-center gap-2.5 mt-8 pt-6 border-t border-slate-700/50">
            {categories.slice(0, 10).map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus:outline-none ${
                  activeCategory === category
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25"
                    : "bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
            {overflowCategories.length > 0 && (
              <CategoryFilter
                categories={overflowCategories}
                activeCategory={activeCategory}
                onChange={handleCategoryChange}
                variant="dark"
                triggerLabel={
                  overflowActive
                    ? activeCategory
                    : `+${overflowCategories.length} more`
                }
                moreButtonActive={overflowActive}
              />
            )}
          </div>
        </div>
      </ScrollReveal>

      {/* Results Info */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-200 shadow-sm">
            <div className="w-2 h-2 bg-sky-500 rounded-full animate-pulse" />
            <p className="text-sm font-medium text-slate-600">
              Showing{" "}
              <span className="text-sky-600 font-semibold">
                {paginatedArticles.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {filteredArticles.length}
              </span>{" "}
              articles
              {activeCategory !== "All" && (
                <span className="text-slate-400">
                  {" "}
                  in <span className="text-slate-700">{activeCategory}</span>
                </span>
              )}
              {searchQuery && (
                <span className="text-slate-400">
                  {" "}
                  matching "<span className="text-sky-600">{searchQuery}</span>"
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      {paginatedArticles.length === 0 ? (
        <ScrollReveal animation="fade" duration={500}>
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700">
              No articles found
            </h3>
            <p className="text-slate-500 mt-1">
              Try adjusting your search or filter
            </p>
          </div>
        </ScrollReveal>
      ) : (
        <StaggerReveal staggerDelay={80} animation="fade-up">
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {paginatedArticles.map((article) => (
              <ArticleCard
                key={article.article_id}
                article={article}
                mode="guest"
              />
            ))}
          </div>
        </StaggerReveal>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <ScrollReveal animation="fade-up" duration={400}>
          <Pagination
            current={safePage}
            total={totalPages}
            onChange={handlePageChange}
          />
        </ScrollReveal>
      )}
    </div>
  );
}
