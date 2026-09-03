import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";

import formatCount from "@/utils/formatCount";
import { capitalizeFirstLetter, stripMarkdown } from "@/utils/stringUtils";

// Reader-side list item for Explore inside the User Panel. The shared
// ArticleCard stays on the Guest homepage; this one follows the panel's
// hairline, no-card language.
export default function ExploreItem({ article }) {
  const [failed, setFailed] = useState(false);
  const title = capitalizeFirstLetter(article.title);
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <article className="group relative flex flex-col">
      <div className="aspect-[16/10] overflow-hidden rounded-lg bg-ink/[0.05]">
        {article.image_url && !failed ? (
          <img
            src={article.image_url}
            alt=""
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-ink-faint">
            <FileText className="h-6 w-6" aria-hidden="true" />
          </span>
        )}
      </div>

      <p className="mt-4 text-sm font-medium text-moss-700">{article.category}</p>

      <h2 className="mt-1.5 font-editorial text-xl leading-snug text-ink">
        <Link
          to={`/user/articles/${article.id}`}
          className="rounded-sm transition-colors after:absolute after:inset-0 after:content-[''] group-hover:text-moss-800 focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-moss-600 focus-visible:after:ring-offset-4 focus-visible:after:ring-offset-paper"
        >
          {title}
        </Link>
      </h2>

      {article.summary && (
        <p className="mt-2 line-clamp-2 text-[0.9375rem] leading-relaxed text-ink-muted">
          {stripMarkdown(article.summary)}
        </p>
      )}

      <p className="mt-3 flex flex-wrap gap-x-3 text-sm text-ink-muted">
        <span className="font-medium text-ink">{article.author_name}</span>
        {date && <span>{date}</span>}
        <span className="tabular-nums">{formatCount(article.views)} {Number(article.views) === 1 ? "read" : "reads"}</span>
      </p>
    </article>
  );
}
