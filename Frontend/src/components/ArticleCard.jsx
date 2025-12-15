import { Eye, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useCallback, useState, memo } from "react";

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

function ArticleCard({ article, onDelete, onEdit }) {
  const navigate = useNavigate();
  const [isConfirmOpen, setConfirmOpen] = useState(false);

  /* 🔒 Block background scroll when modal is open */
  useEffect(() => {
    document.body.style.overflow = isConfirmOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [isConfirmOpen]);

  /* Handlers (memoized) */
  const handleNavigate = useCallback(() => {
    if (!isConfirmOpen) {
      navigate(`/articles/${article.id}`);
    }
  }, [isConfirmOpen, navigate, article.id]);

  const handleEdit = useCallback(
    (e) => {
      e.stopPropagation();
      onEdit?.(article.id);
    },
    [onEdit, article.id]
  );

  const handleDeleteClick = useCallback((e) => {
    e.stopPropagation();
    setConfirmOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    onDelete?.(article.id);
    setConfirmOpen(false);
  }, [onDelete, article.id]);

  return (
    <>
      {/* Article Card */}
      <article
        onClick={handleNavigate}
        className="relative bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
      >
        {/* Status */}
        <span
          className={`absolute top-3 left-3 z-10 text-xs font-semibold px-3 py-1 rounded-full ${
            STATUS_COLORS[article.status]
          }`}
        >
          {article.status}
        </span>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 z-10 flex gap-2">
          <ActionButton
            onClick={handleEdit}
            title="Edit"
            hover="hover:bg-indigo-50"
          >
            <Edit className="w-4 h-4 text-indigo-600" />
          </ActionButton>

          <ActionButton
            onClick={handleDeleteClick}
            title="Delete"
            hover="hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </ActionButton>
        </div>

        {/* Image */}
        {article.featuredImage && (
          <div className="h-48 overflow-hidden">
            <img
              src={article.featuredImage}
              alt={article.title}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
              {article.category}
            </span>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Eye className="w-3 h-3" />
              <span>{article.likes}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-indigo-600">
            {article.title}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {article.summary}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-medium text-gray-700">
              {article.authorName}
            </span>
            <span>
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleDateString()
                : "Not published"}
            </span>
          </div>
        </div>
      </article>

      {/* Confirm Dialog */}
      {isConfirmOpen && (
        <ConfirmDialog
          title="Delete Article"
          description={`Are you sure you want to delete "${article.title}"? This action cannot be undone.`}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={handleConfirmDelete}
        />
      )}
    </>
  );
}

/* 🔁 Prevent unnecessary re-renders */
export default memo(ArticleCard);

/* ------------------ */
/* Reusable Components */
/* ------------------ */

const ActionButton = memo(({ children, onClick, title, hover }) => (
  <button
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded-full bg-white/80 transition ${hover}`}
  >
    {children}
  </button>
));

const ConfirmDialog = memo(({ title, description, onCancel, onConfirm }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div
      className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6"
      role="dialog"
      aria-modal="true"
    >
      <h3 className="text-lg font-semibold mb-2">{title}</h3>

      <p className="text-sm text-gray-600 mb-6">{description}</p>

      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
        >
          No
        </button>

        <button
          onClick={onConfirm}
          className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
));
