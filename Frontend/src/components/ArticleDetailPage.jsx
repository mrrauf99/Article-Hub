import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  User,
  Tag,
  Clock,
  Share2,
  Bookmark,
  Eye,
  Heart,
} from "lucide-react";
import { useState, useEffect } from "react";
import { initialArticles } from "../features/user_panel/utility/articles";

export default function ArticleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [articles] = useState(initialArticles);
  const [isLoading, setIsLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [views, setViews] = useState(Math.floor(Math.random() * 1000) + 100);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const article = articles.find((a) => String(a.id) === id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">📄</div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Article Not Found
          </h1>
          <p className="text-gray-500 mb-6">
            The article you're looking for doesn't exist.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-300 font-medium shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  const imageSrc = article.featuredImage || article.image;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.introduction,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  };

  const formatReadingTime = (content) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Back Navigation */}
      <div className="sticky top-0 z-10 backdrop-blur-sm bg-white/80 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <button
            onClick={() => navigate(-1)}
            className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-all duration-300 font-medium shadow-sm hover:shadow"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Articles
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Article Header */}
        <div className="mb-12">
          {/* Category Badge */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full border border-indigo-100 text-sm font-semibold">
              <Tag className="w-3 h-3" />
              {article.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-6">
            {article.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-8">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 flex items-center justify-center">
                <User className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800">
                  {article.authorName || "Unknown Author"}
                </p>
                <p className="text-sm">Author</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="font-medium">
                {article.publishedAt
                  ? new Date(article.publishedAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : new Date(article.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-gray-400" />
              <span className="font-medium">
                {formatReadingTime(article.content)}
              </span>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 ${
                  isLiked ? "text-red-500" : "text-gray-500"
                } hover:text-red-600 transition-colors`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`} />
                <span>{isLiked ? "Liked" : "Like"}</span>
              </button>

              <div className="flex items-center gap-2 text-gray-500">
                <Eye className="w-5 h-5" />
                <span>{views.toLocaleString()} views</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="relative group inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50 text-gray-700 hover:text-indigo-700 transition-all duration-300"
            >
              <Share2 className="w-4 h-4" />
              Share
              {showShareTooltip && (
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap">
                  Link copied!
                </div>
              )}
            </button>

            <button
              onClick={() => setIsBookmarked(!isBookmarked)}
              className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg transition-all duration-300 ${
                isBookmarked
                  ? "bg-amber-50 border-amber-200 text-amber-700"
                  : "bg-white border-gray-200 text-gray-700 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700"
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
              />
              {isBookmarked ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* Featured Image */}
        {imageSrc && (
          <div className="mb-12 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative overflow-hidden rounded-2xl border border-gray-100 shadow-lg">
              <img
                src={imageSrc}
                alt={article.title}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
            </div>
          </div>
        )}

        {/* Introduction */}
        {article.introduction && (
          <div className="mb-10">
            <div className="relative">
              <div className="absolute -left-4 top-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"></div>
              <p className="text-2xl font-light text-gray-700 leading-relaxed pl-6 italic">
                {article.introduction}
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="prose prose-lg max-w-none prose-gray mb-16">
          <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
              {article.content}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
