import { useLoaderData, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { normalizeMarkdown } from "@/utils/stringUtils";

import { Calendar, User, Tag, Share2, Eye, ArrowLeft, Check } from "lucide-react";
import SEO from "@/components/SEO";
import { SITE_CONFIG } from "@/config/site.config";
import toCanonicalUrl from "@/utils/canonicalUrl";
import formatCount from "@/utils/formatCount";
import { capitalizeFirstLetter } from "@/utils/stringUtils";
import optimizeCloudinaryUrl, {
  buildCloudinarySrcSet,
} from "@/utils/cloudinaryImage";
import SaveArticleButton from "../components/SaveArticleButton";
import useArticleView from "../hooks/useArticleView";
import { buildArticleDescription, createArticleSchema } from "../utils/articleMetadata";

const ARTICLE_IMAGE_WIDTHS = [320, 480, 768, 1200];

export default function PublicArticleDetailPage() {
  const { article } = useLoaderData();
  useArticleView(article);

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
        <p className="text-ink-muted">We couldn't find that article.</p>
      </div>
    );
  }

  const canonicalPath = "/articles/" + encodeURIComponent(article.id);
  const metaDescription = buildArticleDescription(article);
  const imageUrl = article.image_url || SITE_CONFIG.ogImage;
  const canonicalUrl = toCanonicalUrl(canonicalPath);
  const articleSchema = createArticleSchema(article, canonicalUrl, metaDescription);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_CONFIG.siteUrl },
      ...(article.category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: article.category,
              item: `${SITE_CONFIG.siteUrl}/?category=${encodeURIComponent(article.category)}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: article.category ? 3 : 2,
        name: capitalizeFirstLetter(article.title),
        item: canonicalUrl,
      },
    ],
  };

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
      return;
    }
  }

  return (
    <article className="min-h-screen bg-paper font-ui">
      <SEO
        title={capitalizeFirstLetter(article.title)}
        description={metaDescription}
        canonicalPath={canonicalPath}
        image={imageUrl}
        type="article"
        noindex={article.status !== "approved"}
        nofollow={article.status !== "approved"}
        schema={[articleSchema, breadcrumbSchema]}
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

              <SaveArticleButton article={article} />

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
              src={optimizeCloudinaryUrl(article.image_url, { width: 1200 })}
              srcSet={buildCloudinarySrcSet(
                article.image_url,
                ARTICLE_IMAGE_WIDTHS,
              )}
              sizes="(min-width: 704px) 672px, calc(100vw - 2rem)"
              alt={article.title}
              className="w-full rounded-xl mb-10 object-cover border border-hairline"
              width={1200}
              height={675}
              loading="eager"
              fetchpriority="high"
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
                {normalizeMarkdown(article.introduction)}
              </ReactMarkdown>
            )}
            {article.content && (
              <ReactMarkdown>{normalizeMarkdown(article.content)}</ReactMarkdown>
            )}
            {article.summary && (
              <ReactMarkdown>{normalizeMarkdown(article.summary)}</ReactMarkdown>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
