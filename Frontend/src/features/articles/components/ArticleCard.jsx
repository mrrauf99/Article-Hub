import { useState } from "react";

import { Eye, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRef, memo } from "react";
import ConfirmModal from "../ui/ConfirmModal";

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

function ArticleCard({ article, mode }) {
  const navigate = useNavigate();
  const confirmRef = useRef(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const openArticle = () => {
    console.log("Navigating to article:", article.article_id);
    navigate(`/articles/${article.article_id}`);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/dashboard/articles/edit/${article.article_id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    confirmRef.current?.open();
  };

  const confirmDelete = () => {
    // Implement delete functionality here
  };

  return (
    <>
      <article
        onClick={openArticle}
        className="relative bg-white rounded-xl border border-gray-200 shadow-md hover:shadow-xl transition cursor-pointer group overflow-hidden"
      >
        {/* status */}
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${
            STATUS_COLORS[article.status]
          }`}
        >
          {article.status}
        </span>

        {/* action buttons */}
        {mode !== "guest" && (
          <div className="absolute top-3 right-3 flex gap-2">
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
          <div className="h-48 relative overflow-hidden bg-gray-200">
            {!imgLoaded && (
              <div className="absolute inset-0 animate-pulse bg-gray-300" />
            )}

            <img
              src={article.image_url}
              alt={article.title}
              onLoad={() => setImgLoaded(true)}
              className={`w-full h-full object-cover transition-opacity duration-300
        ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            />
          </div>
        )}

        {/* content */}
        <div className="p-5">
          <div className="flex justify-between mb-3">
            <span className="bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full">
              {article.category}
            </span>

            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Eye className="w-5 h-5" />
              <span>{article.views}</span>
            </div>
          </div>

          <h3 className="text-lg font-bold line-clamp-2">{article.title}</h3>

          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {article.conclusion}
          </p>

          <div className="flex justify-between text-xs text-gray-500">
            <span className="font-medium">{article.author_name}</span>
            <span>
              {article.published_at
                ? new Date(article.published_at).toLocaleDateString()
                : "Not published"}
            </span>
          </div>
        </div>
      </article>

      <ConfirmModal
        ref={confirmRef}
        title="Delete Article"
        description={`Are you sure you want to delete "${article.title}"?`}
        onConfirm={confirmDelete}
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
      className="p-1.5 rounded-full bg-white/80 hover:bg-gray-100 transition"
    >
      {children}
    </button>
  );
}
