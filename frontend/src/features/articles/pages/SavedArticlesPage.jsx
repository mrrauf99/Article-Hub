import { Link, useLoaderData, useLocation, useNavigation, useRevalidator, useSearchParams } from "react-router-dom";
import { Bookmark, RefreshCw } from "lucide-react";
import SEO from "@/components/SEO";
import PageHeader from "@/features/user/components/PageHeader";
import EmptyState from "@/features/user/components/EmptyState";
import ExploreItem from "@/features/user/components/ExploreItem";
import Pagination from "@/features/articles/components/Pagination";
import { BTN_SECONDARY } from "@/styles/panelClasses";

export default function SavedArticlesPage() {
  const { articles, pagination, error } = useLoaderData();
  const location = useLocation();
  const navigation = useNavigation();
  const revalidator = useRevalidator();
  const [searchParams, setSearchParams] = useSearchParams();
  const loading = revalidator.state === "loading" || navigation.state === "loading";

  function changePage(page) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params);
  }

  return (
    <div aria-busy={loading}>
      <SEO title="Saved articles" canonicalPath={location.pathname} noindex nofollow />
      <PageHeader title="Saved articles" description="Your reading list, with the most recently saved articles first." />
      <p role="status" className="mt-4 text-sm text-ink-muted">
        {loading ? "Updating saved articles…" : pagination ? `${pagination.totalCount} ${pagination.totalCount === 1 ? "article" : "articles"} saved` : ""}
      </p>

      <div className="mt-8 border-t border-hairline pt-8">
        {error ? (
          <div role="alert">
            <p className="text-sm text-red-700">{error}</p>
            <button type="button" disabled={loading} onClick={() => revalidator.revalidate()} className={`${BTN_SECONDARY} mt-4`}>
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {loading ? "Loading…" : "Try again"}
            </button>
          </div>
        ) : articles.length === 0 ? (
          <EmptyState
            icon={Bookmark}
            title="No saved articles yet"
            action={<Link to="/user/articles" className={BTN_SECONDARY}>Explore articles</Link>}
          >
            Save an article while browsing or reading, and you'll find it here. Articles you can no longer access are hidden.
          </EmptyState>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <ExploreItem key={article.id} article={article} basePath="/user/articles" showSavedAt />
            ))}
          </div>
        )}
        {pagination?.totalPages > 1 && (
          <div className="mt-10 [&_nav]:flex-wrap">
            <Pagination current={pagination.page} total={pagination.totalPages} onChange={changePage} />
          </div>
        )}
      </div>
    </div>
  );
}
