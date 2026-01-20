import { useState, useEffect, useRef } from "react";
import { useLoaderData, useSearchParams, useFetcher } from "react-router-dom";
import { LayoutGrid, CheckCircle2, Clock, XCircle } from "lucide-react";

import {
  PageHeader,
  PillFilter,
  SearchInput,
} from "../components/AdminFilters";
import Pagination from "@/features/articles/components/Pagination";
import ArticlesTable from "../components/ArticlesTable";
import ArticleDetailModal from "../components/ArticleDetailModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import ConfirmDialog from "@/components/ConfirmDialog";

const STATUS_OPTIONS = [
  {
    value: "all",
    label: "All",
    icon: LayoutGrid,
    activeClasses: "bg-slate-900 text-white shadow-lg shadow-slate-900/25",
  },
  {
    value: "approved",
    label: "Approved",
    icon: CheckCircle2,
    activeClasses:
      "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30",
  },
  {
    value: "pending",
    label: "Pending",
    icon: Clock,
    activeClasses:
      "bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-500/30",
  },
  {
    value: "rejected",
    label: "Rejected",
    icon: XCircle,
    activeClasses:
      "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-lg shadow-rose-500/30",
  },
];

export default function AdminArticlesPage() {
  const { articles, pagination, filters } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const fetcher = useFetcher();

  const [searchValue, setSearchValue] = useState(filters.search);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmApprove, setConfirmApprove] = useState(null);
  const [confirmReject, setConfirmReject] = useState(null);

  const isSubmitting = fetcher.state !== "idle";
  const pendingArticleId = fetcher.formData?.get("articleId");
  const pendingIntent = fetcher.formData?.get("intent");

  const handleStatusChange = (status) => {
    const params = new URLSearchParams(searchParams);
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page");
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    } else {
      params.delete("search");
    }
    params.delete("page");
    setSearchParams(params);
  };

  const prevPageRef = useRef(pagination.page);
  const prevFiltersRef = useRef({
    status: filters.status,
    search: filters.search,
  });

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    setSearchParams(params, { preventScrollReset: true });
  };

  useEffect(() => {
    const pageChanged = prevPageRef.current !== pagination.page;
    const filtersChanged =
      prevFiltersRef.current.status !== filters.status ||
      prevFiltersRef.current.search !== filters.search;

    if (pageChanged || filtersChanged) {
      const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      };

      const timeoutId = setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(scrollToTop);
        });
      }, 100);

      prevPageRef.current = pagination.page;
      prevFiltersRef.current = {
        status: filters.status,
        search: filters.search,
      };

      return () => clearTimeout(timeoutId);
    }
  }, [pagination.page, filters.status, filters.search]);

  const handleDelete = () => {
    if (!confirmDelete) return;
    setConfirmDelete(null);
    fetcher.submit(
      { intent: "delete", articleId: confirmDelete.article_id },
      { method: "post" },
    );
  };

  const handleApprove = () => {
    if (!confirmApprove) return;
    setConfirmApprove(null);
    fetcher.submit(
      { intent: "approve", articleId: confirmApprove.article_id },
      { method: "post" },
    );
  };

  const handleReject = () => {
    if (!confirmReject) return;
    setConfirmReject(null);
    fetcher.submit(
      { intent: "reject", articleId: confirmReject.article_id },
      { method: "post" },
    );
  };

  // Helper to check if an action is pending for a specific article
  const getLoadingAction = (articleId) => {
    if (isSubmitting && pendingArticleId === String(articleId)) {
      return `${pendingIntent}-${articleId}`;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Manage Articles"
        subtitle="Review, approve, or reject article submissions"
      >
        <div className="text-sm text-slate-500">
          Total:{" "}
          <span className="font-semibold text-slate-900">
            {pagination.totalCount}
          </span>{" "}
          articles
        </div>
      </PageHeader>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3 sm:gap-4 w-full">
          <div className="w-full lg:w-auto overflow-x-auto scrollbar-hide -mx-3 sm:mx-0 px-3 sm:px-0">
            <PillFilter
              options={STATUS_OPTIONS}
              value={filters.status}
              onChange={handleStatusChange}
            />
          </div>
          <div className="w-full lg:w-auto">
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              onSubmit={handleSearch}
              placeholder="Search by title or author..."
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <ArticlesTable
        articles={articles}
        getLoadingAction={getLoadingAction}
        onViewArticle={setSelectedArticle}
        onApprove={(article) => setConfirmApprove(article)}
        onReject={(article) =>
          setConfirmReject({
            article_id: article.article_id,
            title: article.title,
          })
        }
        onDelete={setConfirmDelete}
      />

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Pagination
          current={pagination.page}
          total={pagination.totalPages}
          onChange={handlePageChange}
        />
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onApprove={(article) => {
            setConfirmApprove(article);
            setSelectedArticle(null);
          }}
          onReject={(id) => {
            setConfirmReject({ article_id: id, title: selectedArticle?.title });
            setSelectedArticle(null);
          }}
          showInternalConfirmations={false}
        />
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <ConfirmDeleteModal
          title="Delete Article"
          message={
            <>
              Are you sure you want to delete{" "}
              <strong>"{confirmDelete.title}"</strong>?
            </>
          }
          isLoading={isSubmitting && pendingIntent === "delete"}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}

      {/* Approve Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!confirmApprove}
        title="Approve Article"
        message={
          confirmApprove
            ? `Are you sure you want to approve "${confirmApprove.title}"?`
            : ""
        }
        confirmText="Yes, Approve"
        cancelText="Cancel"
        variant="info"
        isLoading={isSubmitting && pendingIntent === "approve"}
        onConfirm={handleApprove}
        onCancel={() => setConfirmApprove(null)}
      />

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!confirmReject}
        title="Reject Article"
        message={
          confirmReject
            ? `Are you sure you want to reject "${confirmReject.title}"?`
            : ""
        }
        confirmText="Yes, Reject"
        cancelText="Cancel"
        variant="danger"
        isLoading={isSubmitting && pendingIntent === "reject"}
        onConfirm={handleReject}
        onCancel={() => setConfirmReject(null)}
      />
    </div>
  );
}
