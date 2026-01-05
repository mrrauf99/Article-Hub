import { useState } from "react";
import { useLoaderData, useSearchParams, useFetcher } from "react-router-dom";
import { LayoutGrid, CheckCircle2, Clock, XCircle } from "lucide-react";

import {
  PageHeader,
  PillFilter,
  SearchInput,
  SimplePagination,
} from "../components/AdminFilters";
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

  const handlePageChange = (page) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page);
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const handleAction = (intent, articleId) => {
    fetcher.submit({ intent, articleId }, { method: "post" });
  };

  const handleDelete = () => {
    if (!confirmDelete) return;
    fetcher.submit(
      { intent: "delete", articleId: confirmDelete.article_id },
      { method: "post" }
    );
    setConfirmDelete(null);
  };

  const handleApprove = () => {
    if (!confirmApprove) return;
    fetcher.submit(
      { intent: "approve", articleId: confirmApprove.article_id },
      { method: "post" }
    );
    setConfirmApprove(null);
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
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <PillFilter
            options={STATUS_OPTIONS}
            value={filters.status}
            onChange={handleStatusChange}
          />
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            onSubmit={handleSearch}
            placeholder="Search by title or author..."
          />
        </div>
      </div>

      {/* Table */}
      <ArticlesTable
        articles={articles}
        getLoadingAction={getLoadingAction}
        onViewArticle={setSelectedArticle}
        onApprove={(article) => setConfirmApprove(article)}
        onReject={(id) => handleAction("reject", id)}
        onDelete={setConfirmDelete}
      />

      {/* Pagination */}
      <SimplePagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />

      {/* Article Detail Modal */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onApprove={(article) => setConfirmApprove(article)}
          onReject={(id) => handleAction("reject", id)}
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

      {/* Approve Confirmation Modal (reusing shared ConfirmDialog) */}
      <ConfirmDialog
        isOpen={!!confirmApprove}
        title="Approve Article"
        message={
          confirmApprove
            ? `Are you sure you want to approve "${confirmApprove.title}"?`
            : ""
        }
        confirmText="Approve"
        cancelText="Cancel"
        variant="info"
        isLoading={isSubmitting && pendingIntent === "approve"}
        onConfirm={handleApprove}
        onCancel={() => setConfirmApprove(null)}
      />
    </div>
  );
}
