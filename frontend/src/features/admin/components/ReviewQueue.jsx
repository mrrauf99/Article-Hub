import { Check, X } from "lucide-react";

import { capitalizeFirstLetter } from "@/utils/stringUtils";
import {
  BTN_GHOST_SM,
  BTN_PRIMARY_SM,
  BTN_SECONDARY_SM,
} from "@/styles/panelClasses";
import { ageInDays, formatAge, formatDate } from "../utils/format";

const OVERDUE_DAYS = 3;

function QueueRow({ article, onReview, onDecide, busy, leaving }) {
  const title = capitalizeFirstLetter(article.title);
  const overdue = ageInDays(article.created_at) >= OVERDUE_DAYS;

  return (
    <li
      className={`grid transition-[grid-template-rows,opacity] duration-300 motion-reduce:transition-none ${
        leaving ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)" }}
    >
      <div className="min-h-0 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-hairline py-4 md:flex-row md:items-center md:gap-6">
          <div className="min-w-0 flex-1">
            <button
              type="button"
              onClick={() => onReview(article)}
              data-queue-title={article.id}
              className="rounded-sm text-left font-editorial text-[1.125rem] leading-snug text-ink transition-colors hover:text-moss-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
            >
              {title}
            </button>
            <p className="mt-1 text-sm text-ink-muted">
              <span className="text-ink">{article.author_name}</span>
              <span aria-hidden="true"> · </span>
              <time dateTime={article.created_at} className="tabular-nums">
                Created {formatDate(article.created_at)}
              </time>{" "}
              <span
                className={
                  overdue ? "font-medium text-review-amber-text" : undefined
                }
              >
                ({formatAge(article.created_at)})
              </span>
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => onReview(article)}
              className={BTN_GHOST_SM}
            >
              Preview
            </button>
            <button
              type="button"
              onClick={() => onDecide("reject", article)}
              disabled={busy || leaving}
              className={BTN_SECONDARY_SM}
              aria-label={`Reject "${title}"`}
            >
              <X className="h-4 w-4" aria-hidden="true" />
              Reject
            </button>
            <button
              type="button"
              onClick={() => onDecide("approve", article)}
              disabled={busy || leaving}
              className={BTN_PRIMARY_SM}
              aria-label={`Approve "${title}"`}
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Approve
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default function ReviewQueue({
  articles,
  onReview,
  onDecide,
  submittingId,
  leavingId,
}) {
  return (
    <ol
      aria-label="Articles waiting for review"
      className="border-t border-hairline"
    >
      {articles.map((article) => (
        <QueueRow
          key={article.id}
          article={article}
          onReview={onReview}
          onDecide={onDecide}
          busy={submittingId === String(article.id)}
          leaving={leavingId === String(article.id)}
        />
      ))}
    </ol>
  );
}
