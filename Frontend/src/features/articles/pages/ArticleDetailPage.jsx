import { useNavigate, useLoaderData } from "react-router-dom";
import { useState } from "react";

import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Clock,
  Share2,
  Eye,
  Heart,
} from "lucide-react";

export default function ArticleDetailPage() {
  const article = useLoaderData();
  const navigate = useNavigate();

  const [isLiked, setIsLiked] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  function formatReadingTime(content = "") {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return `${Math.ceil(words / wordsPerMinute)} min read`;
  }

  async function handleShare() {
    const url = window.location.href;

    if (navigator.share) {
      await navigator.share({
        title: article.title,
        text: article.introduction,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
            <Tag className="w-3 h-3" />
            {article.category}
          </span>

          <h1 className="text-4xl font-bold text-gray-900 mt-6 mb-6">
            {article.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{article.author_name || "Unknown"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {new Date(article.published_at).toLocaleDateString()}
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {formatReadingTime(article.content)}
            </div>

            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              {article.views ?? 0}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleShare}
              className="relative inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-indigo-50"
            >
              <Share2 className="w-4 h-4" />
              Share
              {showShareTooltip && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded">
                  Link copied
                </span>
              )}
            </button>

            <button
              onClick={() => setIsLiked((v) => !v)}
              className="inline-flex items-center gap-2 px-4 py-2 border rounded-lg"
            >
              <Heart
                className={`w-4 h-4 ${isLiked && "fill-current text-red-500"}`}
              />
              Like
            </button>
          </div>
        </div>

        {/* Image */}
        {article.image_url && (
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full rounded-xl mb-8"
          />
        )}

        {/* Introduction */}
        {article.introduction && (
          <p className="text-base text-gray-700 leading-relaxed mb-6">
            {article.introduction}
          </p>
        )}

        {/* Content */}
        <div className="prose max-w-none">
          <p className="whitespace-pre-line">{article.content}</p>
        </div>

        {/* Conclusion */}
        {article.conclusion && (
          <p className="mt-8 text-base text-gray-700 leading-relaxed whitespace-pre-line">
            {article.conclusion}
          </p>
        )}
      </div>
    </div>
  );
}
