import { useLoaderData, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import { Calendar, User, Tag, Clock, Share2, Eye, Heart } from "lucide-react";
import SEO from "@/components/SEO";
import { SITE_CONFIG } from "@/config/site.config";
import formatCount from "@/utils/formatCount";

export default function ArticleDetailPage() {
  const { article } = useLoaderData();
  const location = useLocation();

  const [showShareTooltip, setShowShareTooltip] = useState(false);

  // Ensure page scrolls to top on mount (especially important for mobile)
  useEffect(() => {
    if (!article) return;

    // Immediate scroll
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });

    // Additional scroll after render to handle mobile layout shifts
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [article]); // Re-run if article changes

  /* ---------------- Guards ---------------- */
  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Article not found</p>
      </div>
    );
  }

  const canonicalPath = location.pathname;
  const metaDescription = buildDescription(article);
  const imageUrl = article.image_url || SITE_CONFIG.ogImage;
  const canonicalUrl = new URL(canonicalPath, SITE_CONFIG.siteUrl).toString();
  const publisherLogo = new URL(
    SITE_CONFIG.logo,
    SITE_CONFIG.siteUrl,
  ).toString();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: metaDescription,
    image: imageUrl
      ? [new URL(imageUrl, SITE_CONFIG.siteUrl).toString()]
      : undefined,
    author: {
      "@type": "Person",
      name: article.author_name || SITE_CONFIG.name,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
      },
    },
    mainEntityOfPage: canonicalUrl,
  };

  if (article.category) {
    articleSchema.articleSection = article.category;
  }

  if (article.published_at) {
    articleSchema.datePublished = article.published_at;
  }

  if (article.updated_at) {
    articleSchema.dateModified = article.updated_at;
  }

  /* ---------------- Utils ---------------- */
  function formatReadingTime({ content, introduction, summary }) {
    const wordsPerMinute = 200;
    const rawText = `${content} ${introduction} ${summary}`;
    const cleanText = rawText
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    const words = cleanText ? cleanText.split(" ").length : 0;
    return `${Math.max(1, Math.ceil(words / wordsPerMinute))} min read`;
  }

  function buildDescription({ introduction, summary, content }) {
    const preferred = introduction || summary || content || "";
    const cleanText = preferred
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    return cleanText.slice(0, 180) || SITE_CONFIG.description;
  }

  async function handleShare() {
    const url = window.location.href;

    try {
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
    } catch {
      // silent fail (user canceled share)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white w-full">
      <SEO
        title={article.title}
        description={metaDescription}
        canonicalPath={canonicalPath}
        image={imageUrl}
        type="article"
        schema={[articleSchema]}
      />
      <div className="w-full px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10">
        <div className="w-full max-w-4xl mx-auto">
          {/* ================= HEADER ================= */}
          <div className="mb-10">
            {/* Category */}
            {article.category && (
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-semibold">
                <Tag className="w-3 h-3" />
                {article.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl font-bold text-gray-900 mt-6 mb-6 leading-tight">
              {article.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap gap-6 text-gray-600 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author_name || "Unknown author"}</span>
              </div>

              {article.published_at && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date(article.published_at).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{formatReadingTime(article)}</span>
              </div>

              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>{formatCount(article.views)}</span>
              </div>
            </div>

            {/* ================= ACTIONS ================= */}
            <div className="flex gap-3 mt-6">
              {/* Share */}
              <button
                onClick={handleShare}
                className="relative inline-flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-indigo-50 transition"
              >
                <Share2 className="w-4 h-4" />
                Share
                {showShareTooltip && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-black text-white px-2 py-1 rounded">
                    Link copied
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ================= IMAGE ================= */}
          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full rounded-xl mb-8 object-cover"
              loading="lazy"
            />
          )}

          {/* ================= INTRO ================= */}
          {article.introduction && (
            <p className="text-base text-gray-700 leading-relaxed mb-6">
              {article.introduction}
            </p>
          )}

          {/* ================= CONTENT ================= */}
          {article.content && (
            <div className="prose max-w-none">
              <p className="whitespace-pre-line">{article.content}</p>
            </div>
          )}

          {/* ================= CONCLUSION ================= */}
          {article.summary && (
            <p className="mt-8 text-base text-gray-700 leading-relaxed whitespace-pre-line">
              {article.summary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
