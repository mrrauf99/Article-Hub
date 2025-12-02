// src/components/ArticleCard.jsx
import { useState } from "react";
import { Calendar, Eye, ThumbsUp, Edit, Trash2 } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function ArticleCard({
  article,
  mode = "guest", // "guest" | "user" | "admin"
  isExpanded = false,
  onToggle = () => {},
  onUpdate = () => {},
  onDelete = () => {},
  onView = () => {},
  onLike = () => {},
}) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const isGuest = mode === "guest";
  const isUser = mode === "user" || mode === "admin";

  // Fallbacks so card works with different shapes (guest/user)
  const featuredImage = article.featuredImage || article.image;
  const summary = article.summary || article.intro || "";
  const createdDate = article.createdDate || article.createdAt;
  const publishDate = article.publishDate || article.publishedAt;
  const views = article.views ?? 0;
  const likes = article.likes ?? 0;

  return (
    <>
      <article
        className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl 
        transition-shadow duration-300 border border-gray-200 cursor-pointer"
        onClick={() => onView(article.id)}
      >
        {/* IMAGE */}
        {featuredImage && (
          <div className="relative h-48 overflow-hidden bg-gray-200">
            <img
              src={featuredImage}
              alt={article.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />

            {/* USER/ADMIN ONLY = STATUS */}
            {isUser && (
              <div className="absolute top-3 right-3">
                <StatusBadge status={article.status} />
              </div>
            )}
          </div>
        )}

        {/* CONTENT */}
        <div className="p-5">
          {article.category && (
            <span className="inline-block bg-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full mb-3">
              {article.category}
            </span>
          )}

          <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-indigo-600">
            {article.title}
          </h3>

          {summary && (
            <p
              className={`text-gray-600 text-sm ${
                isGuest
                  ? "mb-4 line-clamp-2"
                  : isExpanded
                  ? "mb-2"
                  : "mb-4 line-clamp-2"
              }`}
            >
              {summary}
            </p>
          )}

          {/* USER ONLY — FULL CONTENT */}
          {isUser && isExpanded && (
            <>
              {article.introduction && (
                <p className="text-gray-600 text-sm mb-3">
                  {article.introduction}
                </p>
              )}
              {article.content && (
                <p className="text-gray-700 text-sm mb-4 whitespace-pre-line">
                  {article.content}
                </p>
              )}
            </>
          )}

          {/* DATES */}
          {(createdDate || publishDate) && (
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
              {createdDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(createdDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
              {publishDate && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(publishDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* STATS */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-700">
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-semibold">
                {views.toLocaleString()}
              </span>
              <span className="text-xs text-gray-500">views</span>
            </div>

            <button
              type="button"
              className="flex items-center gap-2 text-gray-700 hover:text-red-500"
              onClick={(e) => {
                e.stopPropagation();
                onLike(article.id);
              }}
            >
              <ThumbsUp className="w-5 h-5 text-red-500" />
              <span className="text-sm font-semibold">{likes}</span>
            </button>
          </div>

          {/* USER-ONLY ACTIONS */}
          {!isGuest && (
            <>
              <button
                type="button"
                className="text-xs text-indigo-700 hover:text-indigo-900 font-medium underline underline-offset-4 mb-3"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(article.id);
                }}
              >
                {isExpanded ? "Show less" : "Show more"}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 px-4 rounded-lg font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>

                <button
                  type="button"
                  className="bg-red-50 hover:bg-red-100 text-red-700 py-2 px-4 rounded-lg font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(article.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </article>

      {/* USER EDIT DIALOG (stub) */}
      {isUser && isEditOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Edit Article</h2>
            <p className="text-sm text-gray-600 mb-6">
              Edit form will go here later.
            </p>
            <button
              type="button"
              className="px-4 py-2 bg-gray-100 rounded-lg"
              onClick={() => setIsEditOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
