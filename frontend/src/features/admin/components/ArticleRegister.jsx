import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, EyeOff, FileText, Trash2, X } from "lucide-react";

import StatusPill from "@/features/user/components/StatusPill";
import formatCount from "@/utils/formatCount";
import { capitalizeFirstLetter } from "@/utils/stringUtils";
import { BTN_PRIMARY_SM, BTN_SECONDARY_SM, ICON_BTN } from "@/styles/panelClasses";
import { formatDate } from "../utils/format";

// The header row is visual only, so each cell carries an sr-only label.
function Labelled({ label, children }) {
  return (
    <>
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">{children}</span>
    </>
  );
}

// Fixed tracks keep per-row grids aligned; pending rows need a wider actions track.
// Breakpoint matches the sidebar's lg switch; Reads/gap are trimmed so the
// flexible title column stays readable down to a 1024px viewport.
const GRID = "lg:grid lg:items-center lg:gap-4";
const COLUMNS = `${GRID} lg:grid-cols-[minmax(0,1fr)_6.5rem_3rem_6.5rem_11.5rem]`;
const COLUMNS_PENDING = `${GRID} lg:grid-cols-[minmax(0,1fr)_6.5rem_3rem_6.5rem_17rem]`;

function Cover({ article }) {
  const [failed, setFailed] = useState(false);

  if (!article.image_url || failed) {
    return (
      <span className="hidden h-12 w-16 shrink-0 items-center justify-center rounded-md bg-ink/[0.05] text-ink-faint sm:flex">
        <FileText className="h-4 w-4" aria-hidden="true" />
      </span>
    );
  }

  return (
    <img
      src={article.image_url}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className="hidden h-12 w-16 shrink-0 rounded-md bg-ink/[0.05] object-cover sm:block"
    />
  );
}

function RowActions({ article, title, onDecide, busy }) {
  const live = article.status === "approved";
  const RejectIcon = live ? EyeOff : X;
  const rejectLabel = live ? "Unpublish" : "Reject";

  return (
    <div className="flex items-center gap-2 lg:justify-end">
      {article.status !== "rejected" && (
        <button
          type="button"
          onClick={() => onDecide("reject", article)}
          disabled={busy}
          className={BTN_SECONDARY_SM}
          aria-label={`${rejectLabel} "${title}"`}
        >
          <RejectIcon className="h-4 w-4" aria-hidden="true" />
          {rejectLabel}
        </button>
      )}
      {article.status !== "approved" && (
        <button
          type="button"
          onClick={() => onDecide("approve", article)}
          disabled={busy}
          className={article.status === "pending" ? BTN_PRIMARY_SM : BTN_SECONDARY_SM}
          aria-label={`Approve "${title}"`}
        >
          <Check className="h-4 w-4" aria-hidden="true" />
          Approve
        </button>
      )}
      <button
        type="button"
        onClick={() => onDecide("delete", article)}
        disabled={busy}
        className={`${ICON_BTN} hover:bg-rejected-red-bg hover:text-rejected-red-text`}
        aria-label={`Delete "${title}"`}
        title="Delete"
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

function RegisterRow({ article, columns, onReview, onDecide, busy }) {
  const title = capitalizeFirstLetter(article.title);
  const reads = formatCount(article.views);
  const readsLabel = `${reads} ${Number(article.views) === 1 ? "read" : "reads"}`;
  const created = formatDate(article.created_at);

  return (
    <li className={`py-4 ${columns}`}>
      <div className="flex min-w-0 items-start gap-4 lg:items-center">
        <Cover article={article} />
        <div className="min-w-0 flex-1">
          <button
            type="button"
            onClick={() => onReview(article)}
            className="line-clamp-2 rounded-sm text-left font-editorial text-[1.0625rem] leading-snug text-ink transition-colors hover:text-moss-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
          >
            {title}
          </button>
          <p className="mt-1 truncate text-sm text-ink-muted">
            {article.author_id ? (
              <Link
                to={`/admin/users/${article.author_id}`}
                className="text-ink underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600 rounded-sm"
              >
                {article.author_name}
              </Link>
            ) : (
              article.author_name
            )}
            {article.category && <> · {article.category}</>}
          </p>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 lg:hidden">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-muted">
              <StatusPill status={article.status} />
              <span className="tabular-nums">{readsLabel}</span>
              <time dateTime={article.created_at}>
                <Labelled label={`Created ${created}`}>{created}</Labelled>
              </time>
            </div>
            <RowActions article={article} title={title} onDecide={onDecide} busy={busy} />
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <StatusPill status={article.status} />
      </div>
      <div className="hidden text-center text-sm tabular-nums text-ink lg:block">
        <Labelled label={readsLabel}>{reads}</Labelled>
      </div>
      <time dateTime={article.created_at} className="hidden text-sm tabular-nums text-ink-muted lg:block">
        <Labelled label={`Created ${created}`}>{created}</Labelled>
      </time>
      <div className="hidden lg:block">
        <RowActions article={article} title={title} onDecide={onDecide} busy={busy} />
      </div>
    </li>
  );
}

export default function ArticleRegister({ articles, onReview, onDecide, submittingId }) {
  const columns = articles.some((a) => a.status === "pending") ? COLUMNS_PENDING : COLUMNS;

  return (
    <>
      <div
        aria-hidden="true"
        className={`hidden border-b border-hairline pb-2.5 text-xs font-medium text-ink-muted ${columns}`}
      >
        <span>Article</span>
        <span>Status</span>
        <span className="text-center">Reads</span>
        <span>Created</span>
        <span className="text-right">Actions</span>
      </div>
      <ul className="divide-y divide-hairline border-b border-hairline">
        {articles.map((article) => (
          <RegisterRow
            key={article.id}
            article={article}
            columns={columns}
            onReview={onReview}
            onDecide={onDecide}
            busy={submittingId === String(article.id)}
          />
        ))}
      </ul>
    </>
  );
}
