import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, PenLine, Trash2 } from "lucide-react";

import ConfirmDialog from "@/components/ConfirmDialog";
import { userApi } from "@/features/api/userApi";
import formatCount from "@/utils/formatCount";
import { capitalizeFirstLetter } from "@/utils/stringUtils";
import { ICON_BTN } from "@/styles/panelClasses";
import StatusPill from "./StatusPill";

const COLUMNS =
  "lg:grid lg:grid-cols-[minmax(0,1fr)_8.5rem_5.5rem_8.5rem_5.5rem] lg:items-center lg:gap-6";

function formatDate(article) {
  if (article.status === "pending") return "Awaiting review";
  if (!article.published_at) return "Not published";
  return new Date(article.published_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function Cover({ article }) {
  const [failed, setFailed] = useState(false);

  if (!article.image_url || failed) {
    return (
      <span className="flex h-12 w-16 shrink-0 items-center justify-center rounded-md bg-ink/[0.05] text-ink-faint">
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
      className="h-12 w-16 shrink-0 rounded-md bg-ink/[0.05] object-cover"
    />
  );
}

function LedgerRow({ article, onRequestDelete }) {
  const title = capitalizeFirstLetter(article.title);
  const detailPath = `/user/articles/${article.id}`;
  const dateText = formatDate(article);
  const dateLabel =
    article.status === "pending" || !article.published_at
      ? dateText
      : `Published ${dateText}`;
  const readsLabel = `${formatCount(article.views)} ${Number(article.views) === 1 ? "read" : "reads"}`;

  return (
    <li className={`group relative -mx-3 rounded-lg px-3 py-4 transition-colors duration-150 hover:bg-ink/[0.025] ${COLUMNS}`}>
      <div className="flex min-w-0 items-start gap-4 lg:items-center">
        <Link to={detailPath} state={{ owned: true }} tabIndex={-1} aria-hidden="true">
          <Cover article={article} />
        </Link>

        <div className="min-w-0 flex-1">
          <Link
            to={detailPath}
            state={{ owned: true }}
            className="line-clamp-2 rounded-sm font-editorial text-[1.0625rem] leading-snug text-ink transition-colors hover:text-moss-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-moss-600"
          >
            {title}
          </Link>
          <p className="mt-1 truncate text-sm text-ink-muted">{article.category}</p>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-muted lg:hidden">
            <StatusPill status={article.status} />
            <span className="tabular-nums">{readsLabel}</span>
            <span aria-label={dateLabel}>{dateText}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 lg:hidden">
          <RowActions article={article} title={title} onRequestDelete={onRequestDelete} />
        </div>
      </div>

      <div className="hidden lg:block">
        <StatusPill status={article.status} />
      </div>
      <div
        className="hidden text-right text-sm tabular-nums text-ink lg:block"
        aria-label={readsLabel}
      >
        {formatCount(article.views)}
      </div>
      <div className="hidden text-sm text-ink-muted lg:block" aria-label={dateLabel}>
        {dateText}
      </div>
      <div className="hidden justify-end gap-1 lg:flex">
        <RowActions article={article} title={title} onRequestDelete={onRequestDelete} />
      </div>
    </li>
  );
}

function RowActions({ article, title, onRequestDelete }) {
  return (
    <>
      <Link
        to={`/user/articles/${article.id}/edit`}
        className={ICON_BTN}
        aria-label={`Edit "${title}"`}
        title="Edit"
      >
        <PenLine className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
      </Link>
      <button
        type="button"
        onClick={() => onRequestDelete(article)}
        className={`${ICON_BTN} hover:bg-rejected-red-bg hover:text-rejected-red-text`}
        aria-label={`Delete "${title}"`}
        title="Delete"
      >
        <Trash2 className="h-[1.05rem] w-[1.05rem]" aria-hidden="true" />
      </button>
    </>
  );
}

export default function ArticleLedger({ articles, onDeleted }) {
  const [target, setTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  const requestDelete = (article) => {
    setDeleteError(null);
    setTarget(article);
  };

  const cancelDelete = () => {
    if (isDeleting) return;
    setTarget(null);
    setDeleteError(null);
  };

  const confirmDelete = async () => {
    if (!target) return;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await userApi.deleteArticle(target.id);
      onDeleted?.(target.id);
      setTarget(null);
    } catch (error) {
      setDeleteError(
        error.response?.data?.message || "Couldn't delete the article. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        aria-hidden="true"
        className={`hidden border-b border-hairline pb-2.5 pt-5 text-xs font-medium text-ink-muted ${COLUMNS}`}
      >
        <span>Article</span>
        <span>Status</span>
        <span className="text-right">Reads</span>
        <span>Published</span>
        <span className="sr-only">Actions</span>
      </div>

      <ul className="divide-y divide-hairline">
        {articles.map((article) => (
          <LedgerRow key={article.id} article={article} onRequestDelete={requestDelete} />
        ))}
      </ul>

      <ConfirmDialog
        isOpen={Boolean(target)}
        title="Delete this article?"
        message={
          target ? (
            <>
              "<strong className="font-semibold text-ink">{capitalizeFirstLetter(target.title)}</strong>" and
              its cover image will be permanently removed. This can't be undone.
            </>
          ) : (
            ""
          )
        }
        confirmMatchText={target ? capitalizeFirstLetter(target.title) : ""}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
        loadingText="Deleting"
        error={deleteError}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </>
  );
}
