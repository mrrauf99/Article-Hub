import { useState } from "react";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { FileText, Inbox, SearchX } from "lucide-react";

import Pagination from "@/features/articles/components/Pagination";
import PageHeader from "@/features/user/components/PageHeader";
import StatusTabs from "@/features/user/components/StatusTabs";
import SearchField from "@/features/user/components/SearchField";
import EmptyState from "@/features/user/components/EmptyState";
import useScrollOnChange from "@/hooks/useScrollOnChange";
import { BTN_SECONDARY } from "@/styles/panelClasses";
import ArticleRegister from "../components/ArticleRegister";
import ArticleReviewDialog from "../components/ArticleReviewDialog";
import ActionNotice from "../components/ActionNotice";
import useArticleModeration from "../hooks/useArticleModeration";

const STATUS_WORD = { approved: "published", pending: "in review", rejected: "rejected" };

function ResultEmpty({ filters, onClearSearch }) {
  if (filters.search) {
    return (
      <EmptyState
        icon={SearchX}
        title={`No articles match "${filters.search}"`}
        action={
          <button type="button" onClick={onClearSearch} className={BTN_SECONDARY}>
            Clear search
          </button>
        }
      >
        Search looks at article titles and author names.
      </EmptyState>
    );
  }
  if (filters.status === "pending") {
    return (
      <EmptyState icon={Inbox} title="Nothing in review">
        Every submitted article has a decision.
      </EmptyState>
    );
  }
  const word = STATUS_WORD[filters.status];
  return (
    <EmptyState icon={FileText} title={word ? `No ${word} articles` : "No articles yet"}>
      Articles appear here once writers create them.
    </EmptyState>
  );
}

export default function AdminArticlesPage() {
  const { articles, pagination, filters, counts } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(filters.search);
  const [reviewing, setReviewing] = useState(null);
  const moderation = useArticleModeration();

  const updateParams = (mutate, options) => {
    const params = new URLSearchParams(searchParams);
    mutate(params);
    params.delete("page");
    setSearchParams(params, options);
  };

  const handleStatusChange = (status) =>
    updateParams((p) => (status === "all" ? p.delete("status") : p.set("status", status)), {
      preventScrollReset: true,
    });

  const handleSearch = (e) => {
    e.preventDefault();
    const value = searchValue.trim();
    updateParams((p) => (value ? p.set("search", value) : p.delete("search")), {
      preventScrollReset: true,
    });
  };

  const clearSearch = () => {
    setSearchValue("");
    updateParams((p) => p.delete("search"), { preventScrollReset: true });
  };

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params, { preventScrollReset: true });
  };

  useScrollOnChange({ deps: [pagination.page], behavior: "smooth", delay: 100 });

  const decide = (type, article) => {
    setReviewing(null);
    moderation.open(type, article);
  };

  const first = (pagination.page - 1) * pagination.limit + 1;
  const last = Math.min(pagination.page * pagination.limit, pagination.totalCount);

  return (
    <>
      <PageHeader
        title="Articles"
        description="Every article on Article Hub, newest first. Open one to read its summary before you decide."
      />

      <div className="mt-8">
        <ActionNotice notice={moderation.notice} onDismiss={moderation.dismissNotice} />
      </div>

      <div className="flex flex-col gap-4 border-b border-hairline md:flex-row md:items-end md:justify-between">
        <StatusTabs value={filters.status} counts={counts} onChange={handleStatusChange} />
        <form role="search" onSubmit={handleSearch} className="pb-3 md:w-72">
          <SearchField
            id="admin-article-search"
            label="Search articles by title or author"
            placeholder="Search title or author"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </form>
      </div>

      {articles.length === 0 ? (
        <ResultEmpty filters={filters} onClearSearch={clearSearch} />
      ) : (
        <>
          <p className="py-4 text-sm text-ink-muted" aria-live="polite">
            <span className="tabular-nums">
              {first}–{last}
            </span>{" "}
            of <span className="tabular-nums">{pagination.totalCount}</span>
            {filters.search && (
              <>
                {" "}matching "<span className="text-ink">{filters.search}</span>"{" "}
                <button
                  type="button"
                  onClick={clearSearch}
                  className="ml-1 rounded-sm font-medium text-moss-700 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
                >
                  Clear
                </button>
              </>
            )}
          </p>

          <ArticleRegister
            articles={articles}
            onReview={setReviewing}
            onDecide={decide}
            submittingId={moderation.submittingId}
          />

          {pagination.totalPages > 1 && (
            <div className="mt-8">
              <Pagination
                current={pagination.page}
                total={pagination.totalPages}
                onChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {reviewing && (
        <ArticleReviewDialog
          article={reviewing}
          onClose={() => setReviewing(null)}
          onDecide={decide}
        />
      )}
      {moderation.dialog}
    </>
  );
}
