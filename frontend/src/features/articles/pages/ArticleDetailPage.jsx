import { Link, useLoaderData, useLocation, useRouteLoaderData } from "react-router-dom";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

import { ArrowLeft, Calendar, Check, Eye, PenLine, Share2, Tag, User } from "lucide-react";
import SEO from "@/components/SEO";
import { SITE_CONFIG } from "@/config/site.config";
import formatCount from "@/utils/formatCount";
import { capitalizeFirstLetter, stripMarkdown } from "@/utils/stringUtils";
import { ARTICLE_PROSE, BTN_SECONDARY } from "@/styles/panelClasses";
import StatusPill from "@/features/user/components/StatusPill";

const OWNER_NOTES = {
  pending: {
    title: "In review.",
    text: "A moderator hasn't looked at this yet, so readers can't see it. We'll email you with the decision.",
    box: "border-review-amber-ring bg-review-amber-bg text-review-amber-text",
  },
  rejected: {
    title: "Rejected.",
    text: "The email we sent has the moderator's reason. Edit the article and resubmit it for review.",
    box: "border-rejected-red-ring bg-rejected-red-bg text-rejected-red-text",
  },
};

export default function ArticleDetailPage() {
  const { article } = useLoaderData();
  const location = useLocation();

  const userPanel = useRouteLoaderData("user-layout");
  const [shareState, setShareState] = useState(null);

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
      <div className="flex min-h-[40vh] items-center justify-center font-ui">
        <p className="text-ink-muted">Article not found</p>
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
    headline: capitalizeFirstLetter(article.title),
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
  function buildDescription({ introduction, summary, content }) {
    const preferred = introduction || summary || content || "";
    const cleanText = stripMarkdown(preferred.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " "));
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
        setShareState("copied");
        setTimeout(() => setShareState(null), 2000);
      }
    } catch (error) {
      // AbortError means the user closed the native share sheet.
      if (error?.name !== "AbortError") {
        setShareState("failed");
        setTimeout(() => setShareState(null), 3000);
      }
    }
  }

  const inAdmin = location.pathname.startsWith("/admin");
  const isOwner =
    Boolean(userPanel) && (article.status !== "approved" || Boolean(location.state?.owned));
  const back = inAdmin
    ? { to: "/admin/articles", label: "Articles" }
    : isOwner
      ? { to: "/user/dashboard", label: "Your articles" }
      : { to: "/user/articles", label: "Explore" };
  const statusNote = isOwner ? OWNER_NOTES[article.status] : null;

  return (
    <article className="font-ui">
      <SEO
        title={article.title}
        description={metaDescription}
        canonicalPath={canonicalPath}
        image={imageUrl}
        type="article"
        schema={[articleSchema]}
      />

      <div className="mx-auto w-full max-w-2xl py-2 sm:py-4">
        <Link
          to={back.to}
          className="mb-8 inline-flex items-center gap-1.5 rounded-sm text-sm text-ink-muted transition-colors hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {back.label}
        </Link>

        {statusNote && (
          <div
            className={`mb-8 flex flex-col gap-3 rounded-xl border px-4 py-3.5 text-sm leading-relaxed sm:flex-row sm:items-center ${statusNote.box}`}
          >
            <p className="flex-1">
              <span className="font-semibold">{statusNote.title}</span> {statusNote.text}
            </p>
            <Link
              to={`/user/articles/${article.id}/edit`}
              className={`${BTN_SECONDARY} h-9 self-start sm:self-auto`}
            >
              <PenLine className="h-4 w-4" aria-hidden="true" />
              Edit
            </Link>
          </div>
        )}

        <header className="mb-8">
          <h1 className="mb-6 font-editorial text-3xl leading-[1.15] text-ink sm:text-4xl lg:text-[2.75rem]">
            {capitalizeFirstLetter(article.title)}
          </h1>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-hairline pb-5 text-sm text-ink-muted">
            {article.category && (
              <span className="flex items-center gap-1.5 font-medium text-moss-700">
                <Tag className="h-4 w-4" aria-hidden="true" />
                {article.category}
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4 text-ink-faint" aria-hidden="true" />
              {article.author_name || "Unknown author"}
            </span>

            {article.published_at && (
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-ink-faint" aria-hidden="true" />
                {new Date(article.published_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}

            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-ink-faint" aria-hidden="true" />
              <span className="tabular-nums">{formatCount(article.views)}</span>
              <span className="sr-only">reads</span>
            </span>

            {(inAdmin || (isOwner && article.status === "approved")) && (
              <StatusPill status={article.status} />
            )}

            {isOwner && article.status === "approved" && (
              <Link
                to={`/user/articles/${article.id}/edit`}
                className="inline-flex items-center gap-1.5 rounded-sm font-medium text-ink transition-colors hover:text-moss-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
              >
                <PenLine className="h-4 w-4" aria-hidden="true" />
                Edit
              </Link>
            )}

            {article.status === "approved" && (
              <button
                type="button"
                onClick={handleShare}
                aria-live="polite"
                className="ml-auto inline-flex items-center gap-1.5 rounded-sm font-medium text-moss-700 transition-colors hover:text-moss-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
              >
                {shareState === "copied" ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                )}
                {shareState === "copied"
                  ? "Link copied"
                  : shareState === "failed"
                    ? "Couldn't copy link"
                    : "Share"}
              </button>
            )}
          </div>
        </header>

        {article.image_url && (
          <img
            src={article.image_url}
            alt=""
            className="mb-10 w-full rounded-xl border border-hairline object-cover"
            loading="lazy"
          />
        )}

        <div className={ARTICLE_PROSE}>
          {article.introduction && (
            <ReactMarkdown>{article.introduction.replace(/\n{3,}/g, "\n\n")}</ReactMarkdown>
          )}
          {article.content && (
            <ReactMarkdown>{article.content.replace(/\n{3,}/g, "\n\n")}</ReactMarkdown>
          )}
          {article.summary && (
            <ReactMarkdown>{article.summary.replace(/\n{3,}/g, "\n\n")}</ReactMarkdown>
          )}
        </div>
      </div>
    </article>
  );
}
