import { useMemo } from "react";
import {
  Link,
  useLoaderData,
  useSearchParams,
  useRevalidator,
} from "react-router-dom";
import { CheckCircle2, FilePlus2, Info, SearchX, X } from "lucide-react";

import SEO from "@/components/SEO";
import Pagination from "@/features/articles/components/Pagination";
import useScrollOnChange from "@/hooks/useScrollOnChange";
import formatCount from "@/utils/formatCount";
import { BTN_PRIMARY, BTN_SECONDARY, ICON_BTN, LINK } from "@/styles/panelClasses";

import PageHeader from "../components/PageHeader";
import StatusTabs from "../components/StatusTabs";
import ArticleLedger from "../components/ArticleLedger";
import EmptyState from "../components/EmptyState";
import SearchField from "../components/SearchField";
import { STATUS_TABS } from "../constants/articleStatus";

const PER_PAGE = 10;
const VALID_STATUSES = new Set(STATUS_TABS.map((t) => t.value));

const SUBMITTED_NOTICES = {
  new: "Article submitted for review. We'll email you once a moderator has approved or rejected it.",
  updated:
    "Changes saved and sent back for review. The article stays hidden from readers until a moderator approves it again.",
};

function Figure({ children }) {
  return <span className="font-semibold tabular-nums text-ink">{children}</span>;
}

export default function UserDashBoardPage() {
  const { articles = [], stats = {} } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const revalidator = useRevalidator();

  const rawStatus = searchParams.get("status") || "all";
  const status = VALID_STATUSES.has(rawStatus) ? rawStatus : "all";
  const query = searchParams.get("q") || "";
  const pageParam = Number(searchParams.get("page")) || 1;
  const submitted = searchParams.get("submitted");

  const counts = useMemo(() => {
    const byStatus = { all: articles.length, approved: 0, pending: 0, rejected: 0 };
    for (const a of articles) {
      if (a.status in byStatus) byStatus[a.status] += 1;
    }
    return byStatus;
  }, [articles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (status !== "all" && a.status !== status) return false;
      if (!q) return true;
      return (
        a.title?.toLowerCase().includes(q) || a.category?.toLowerCase().includes(q)
      );
    });
  }, [articles, status, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const page = Math.min(Math.max(pageParam, 1), totalPages);
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useScrollOnChange({ deps: [page, status], behavior: "smooth", delay: 100 });

  function updateParams(mutate, options = {}) {
    const params = new URLSearchParams(searchParams);
    mutate(params);
    setSearchParams(params, { preventScrollReset: true, ...options });
  }

  function handleStatusChange(next) {
    updateParams((p) => {
      if (next === "all") p.delete("status");
      else p.set("status", next);
      p.delete("page");
    });
  }

  function applySearch(value) {
    updateParams(
      (p) => {
        if (value) p.set("q", value);
        else p.delete("q");
        p.delete("page");
      },
      { replace: true },
    );
  }

  function handleSearchSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    applySearch(formData.get("q")?.toString().trim() || "");
  }

  function handlePageChange(next) {
    updateParams((p) => p.set("page", String(next)));
  }

  function dismissNotice() {
    updateParams((p) => p.delete("submitted"), { replace: true });
  }

  const newArticleButton = (
    <Link to="/user/articles/new" className={BTN_PRIMARY}>
      <FilePlus2 className="h-4 w-4" aria-hidden="true" />
      New article
    </Link>
  );

  const hasArticles = articles.length > 0;
  const noticeText = SUBMITTED_NOTICES[submitted];

  return (
    <div>
      <SEO title="Your articles" canonicalPath="/user/dashboard" noindex nofollow />

      <PageHeader
        title="Your articles"
        description={
          hasArticles ? (
            <>
              <Figure>{counts.approved}</Figure> published,{" "}
              <Figure>{counts.pending}</Figure> in review,{" "}
              <Figure>{counts.rejected}</Figure> rejected.{" "}
              <Figure>{formatCount(stats.views || 0)}</Figure> reads in total.
            </>
          ) : (
            "Write, submit, and track your articles through moderation."
          )
        }
        actions={newArticleButton}
      />

      {noticeText && (
        <div
          role="status"
          className="mt-8 flex items-start gap-3 rounded-xl border border-moss-200 bg-moss-50 px-4 py-3.5 text-sm text-moss-800"
        >
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-moss-800" aria-hidden="true" />
          <p className="flex-1 leading-relaxed">{noticeText}</p>
          <button
            type="button"
            onClick={dismissNotice}
            className={`${ICON_BTN} -my-2 -mr-2 h-8 w-8 text-moss-800 hover:bg-moss-100 hover:text-moss-900`}
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {counts.rejected > 0 && status !== "rejected" && (
        <div className="mt-8 flex flex-col gap-3 rounded-xl border border-hairline bg-paper-raised px-4 py-3.5 text-sm text-ink-muted sm:flex-row sm:items-center">
          <Info className="hidden h-4 w-4 shrink-0 text-ink-faint sm:block" aria-hidden="true" />
          <p className="flex-1 leading-relaxed">
            {counts.rejected === 1
              ? "One article was rejected by a moderator."
              : `${counts.rejected} articles were rejected by moderators.`}{" "}
            The email we sent explains why. Edit and resubmit whenever you're ready.
          </p>
          <button type="button" onClick={() => handleStatusChange("rejected")} className={`${LINK} self-start text-sm sm:self-auto`}>
            Show rejected
          </button>
        </div>
      )}

      {hasArticles ? (
        <section aria-label="Articles" className="mt-10">
          <div className="flex flex-col gap-3 border-b border-hairline md:flex-row md:items-end md:justify-between">
            <StatusTabs value={status} counts={counts} onChange={handleStatusChange} />

            <div className="pb-3 md:w-72">
              <form onSubmit={handleSearchSubmit} role="search">
                <SearchField
                  key={query}
                  id="ledger-search"
                  label="Search your articles"
                  name="q"
                  defaultValue={query}
                  placeholder="Search by title or category"
                />
              </form>
            </div>
          </div>

          {pageItems.length > 0 ? (
            <>
              <ArticleLedger articles={pageItems} onDeleted={() => revalidator.revalidate()} />

              {totalPages > 1 && (
                <div className="mt-10">
                  <Pagination current={page} total={totalPages} onChange={handlePageChange} />
                </div>
              )}
            </>
          ) : query ? (
            <EmptyState
              icon={SearchX}
              title={`Nothing matches "${query}"`}
              action={
                <button type="button" onClick={() => applySearch("")} className={BTN_SECONDARY}>
                  Clear search
                </button>
              }
            >
              Try a different word from the title, or search by category.
            </EmptyState>
          ) : (
            <EmptyState
              icon={Info}
              title={
                status === "pending"
                  ? "Nothing waiting for review"
                  : status === "approved"
                    ? "Nothing published yet"
                    : "No rejected articles"
              }
              action={
                <button type="button" onClick={() => handleStatusChange("all")} className={BTN_SECONDARY}>
                  Show all articles
                </button>
              }
            >
              {status === "pending"
                ? "Articles you submit wait here until a moderator reviews them."
                : status === "approved"
                  ? "Once a moderator approves one of your articles, it shows up here and on the public site."
                  : "Rejected articles would appear here so you can revise and resubmit them."}
            </EmptyState>
          )}
        </section>
      ) : (
        <div className="mt-10 border-t border-hairline">
          <EmptyState icon={FilePlus2} title="You haven't written anything yet" action={newArticleButton}>
            Every article is read by a moderator before it goes live. Write your first one, submit
            it for review, and follow its progress from here.
          </EmptyState>
        </div>
      )}
    </div>
  );
}
