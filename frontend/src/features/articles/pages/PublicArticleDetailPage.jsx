import { useLoaderData, useLocation, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import { Calendar, User, Tag, Share2, Eye, ArrowLeft, Check } from "lucide-react";
import SEO from "@/components/SEO";
import { SITE_CONFIG } from "@/config/site.config";
import formatCount from "@/utils/formatCount";
import { capitalizeFirstLetter } from "@/utils/stringUtils";

/**
 * Guest-facing reading view. Kept separate from the shared
 * `ArticleDetailPage` — that component is also rendered inside the User and
 * Admin panels (`/user/articles/:id`, `/admin/articles/:id`), so it stays
 * untouched. Only the public `/articles/:id` route points here.
 */
export default function PublicArticleDetailPage() {
  const { article } = useLoaderData();
  const location = useLocation();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!article) return;
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const timeoutId = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [article]);

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper font-ui">
        <p className="text-ink-muted">Article not found</p>
      </div>
    );
  }

  const canonicalPath = location.pathname;
  const metaDescription = buildDescription(article);
  const imageUrl = article.image_url || SITE_CONFIG.ogImage;
  const canonicalUrl = new URL(canonicalPath, SITE_CONFIG.siteUrl).toString();
  const publisherLogo = new URL(SITE_CONFIG.logo, SITE_CONFIG.siteUrl).toString();

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: capitalizeFirstLetter(article.title),
    description: metaDescription,
    image: imageUrl ? [new URL(imageUrl, SITE_CONFIG.siteUrl).toString()] : undefined,
    author: { "@type": "Person", name: article.author_name || SITE_CONFIG.name },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: { "@type": "ImageObject", url: publisherLogo },
    },
    mainEntityOfPage: canonicalUrl,
  };
  if (article.category) articleSchema.articleSection = article.category;
  if (article.published_at) articleSchema.datePublished = article.published_at;
  if (article.updated_at) articleSchema.dateModified = article.updated_at;

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
        await navigator.share({ title: article.title, text: article.introduction, url });
      } else {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // silent fail (user canceled share)
    }
  }

  return (
    <article className="min-h-screen bg-paper font-ui">
      <SEO
        title={article.title}
        description={metaDescription}
        canonicalPath={canonicalPath}
        image={imageUrl}
        type="article"
        schema={[articleSchema]}
      />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="w-full max-w-2xl mx-auto">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to articles
          </Link>

          <header className="mb-8">
            {article.category && (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-moss-700 mb-4">
                <Tag className="w-3 h-3" />
                {article.category}
              </span>
            )}

            <h1 className="font-editorial text-3xl sm:text-4xl lg:text-[2.75rem] text-ink leading-[1.15] mb-6">
              {capitalizeFirstLetter(article.title)}
            </h1>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted pb-5 border-b border-hairline">
              <span className="flex items-center gap-1.5">
                <User className="w-4 h-4 text-ink-faint" />
                {article.author_name || "Unknown author"}
              </span>

              {article.published_at && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-ink-faint" />
                  {new Date(article.published_at).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-ink-faint" />
                {formatCount(article.views)}
              </span>

              <button
                onClick={handleShare}
                className="relative inline-flex items-center gap-1.5 ml-auto text-moss-700 hover:text-moss-800 font-medium transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copied ? "Copied" : "Share"}
              </button>
            </div>
          </header>

          {article.image_url && (
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full rounded-xl mb-10 object-cover border border-hairline"
              loading="lazy"
            />
          )}

          <div
            className="prose prose-neutral max-w-[58ch]
              prose-headings:font-editorial prose-headings:text-ink
              prose-p:text-ink-muted prose-p:leading-relaxed
              prose-a:text-moss-700 prose-a:no-underline hover:prose-a:underline
              prose-strong:text-ink prose-blockquote:border-moss-300 prose-blockquote:text-ink-muted
              prose-code:text-ink prose-code:bg-paper-raised prose-img:rounded-lg"
          >
            {article.introduction && (
              <ReactMarkdown>
                {article.introduction.replace(/\n{3,}/g, "\n\n")}
              </ReactMarkdown>
            )}
            {article.content && (
              <ReactMarkdown>{article.content.replace(/\n{3,}/g, "\n\n")}</ReactMarkdown>
            )}
            {article.summary && (
              <ReactMarkdown>{article.summary.replace(/\n{3,}/g, "\n\n")}</ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
