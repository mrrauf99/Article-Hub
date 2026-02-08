import { useState, memo } from "react";
import { Eye, Trash2, Edit, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

import StatusBadge from "./StatusBadge";
import ConfirmDialog from "@/components/ConfirmDialog";
import { userApi } from "@/features/api/userApi";
import formatCount from "@/utils/formatCount";

function ArticleCard({ article, mode, onDelete }) {
  const navigate = useNavigate();
  const [imgLoaded, setImgLoaded] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const openArticle = () => {
    navigate(`/user/articles/${article.article_id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/user/articles/${article.article_id}/edit`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setDeleteError(null);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await userApi.deleteArticle(article.article_id);

      // Call the onDelete callback if provided
      if (onDelete) {
        onDelete(article.article_id);
      }
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete article:", error);
      setDeleteError(
        error.response?.data?.message ||
          "Failed to delete article. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    if (!isDeleting) {
      setIsDeleteModalOpen(false);
      setDeleteError(null);
    }
  };

  return (
    <>
      <article
        onClick={openArticle}
        className="relative bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer group overflow-hidden hover:-translate-y-1"
      >
        {/* status */}
        {mode !== "guest" && (
          <div className="absolute top-3 left-3 z-10">
            <StatusBadge status={article.status} />
          </div>
        )}

        {mode !== "guest" && (
          <div className="absolute top-3 right-3 z-10 flex gap-2">
            <ActionButton title="Edit" onClick={handleEdit}>
              <Edit className="w-4 h-4 text-indigo-600" />
            </ActionButton>

            <ActionButton title="Delete" onClick={handleDelete}>
              <Trash2 className="w-4 h-4 text-red-600" />
            </ActionButton>
          </div>
        )}

        {/* image */}
        {article.image_url && (
          <div className="h-48 relative overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200" />
            )}

            <img
              src={article.image_url}
              alt={article.title}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-contain sm:object-cover transition-all duration-500 group-hover:scale-105
        ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}

        {/* content */}
        <div className="p-5">
          <div className="flex justify-between items-center mb-3">
            <span className="bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full border border-indigo-100">
              {article.category}
            </span>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 bg-slate-50 px-2.5 py-1 rounded-full">
              <Eye className="w-3.5 h-3.5" />
              <span className="font-medium">{formatCount(article.views)}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-200">
            {article.title}
          </h3>

          <p className="text-sm text-slate-600 line-clamp-2 mt-2 mb-4 leading-relaxed">
            {article.summary}
          </p>

          <div className="flex justify-between items-center pt-4 border-t border-slate-100">
            <span className="text-sm font-semibold text-slate-700">
              {article.author_name}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5" />
              {article.published_at
                ? new Date(article.published_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Draft"}
            </span>
          </div>
        </div>
      </article>

      <ConfirmDialog
        isOpen={isDeleteModalOpen}
        title="Delete Article"
        message={`Are you sure you want to delete "${article.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        loadingText="Deleting"
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}

export default memo(ArticleCard);

function ActionButton({ children, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-110"
    >
      {children}
    </button>
  );
}
