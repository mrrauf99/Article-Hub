import { Link } from "react-router-dom";

import StatusPill from "@/features/user/components/StatusPill";
import { capitalizeFirstLetter } from "@/utils/stringUtils";
import { LINK } from "@/styles/panelClasses";
import { formatAge } from "../utils/format";

export default function RecentSubmissions({ articles, onReview }) {
  return (
    <section aria-labelledby="recent-heading" className="mt-12">
      <div className="flex items-baseline justify-between gap-3">
        <h2 id="recent-heading" className="text-sm font-semibold text-ink">
          Newest articles
        </h2>
        <Link to="/admin/articles" className={`${LINK} text-sm`}>
          All articles
        </Link>
      </div>

      {articles.length === 0 ? (
        <p className="mt-3 text-sm text-ink-muted">No articles yet.</p>
      ) : (
        <ul className="mt-2 border-t border-hairline">
          {articles.map((article) => (
            <li
              key={article.id}
              className="flex flex-col gap-2 border-b border-hairline py-3 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onReview(article)}
                  className="block max-w-full truncate rounded-sm text-left text-sm font-medium text-ink transition-colors hover:text-moss-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
                >
                  {capitalizeFirstLetter(article.title)}
                </button>
                <p className="mt-0.5 truncate text-sm text-ink-muted">
                  {article.author_name} · {formatAge(article.created_at)}
                </p>
              </div>
              <StatusPill status={article.status} className="self-start sm:self-auto" />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
