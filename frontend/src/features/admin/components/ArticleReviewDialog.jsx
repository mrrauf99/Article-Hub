import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Check, EyeOff, Trash2, X } from "lucide-react";

import AdminDialog from "./AdminDialog";
import MemberAvatar from "./MemberAvatar";
import StatusPill from "@/features/user/components/StatusPill";
import { adminApi } from "@/features/api/adminApi";
import formatCount from "@/utils/formatCount";
import { capitalizeFirstLetter, stripMarkdown } from "@/utils/stringUtils";
import { BTN_GHOST, BTN_PRIMARY, BTN_SECONDARY, LINK } from "@/styles/panelClasses";
import { ageInDays, formatAge, formatDate, plural } from "../utils/format";

const NEW_ACCOUNT_DAYS = 7;
const DIALOG_TITLE = {
  pending: "Review submission",
  approved: "Published article",
  rejected: "Rejected article",
};
const OWN_HOSTS = ["articlehub.me", "res.cloudinary.com"];

// Distinct outbound link hosts (a spam signal), excluding our own domains.
function outboundHosts(...texts) {
  const hosts = new Set();
  const matches = texts.join(" ").match(/https?:\/\/[^\s<>"')\]]+|www\.[^\s<>"')\]]+/gi) || [];
  for (const raw of matches) {
    try {
      const host = new URL(raw.startsWith("www.") ? `https://${raw}` : raw).hostname
        .replace(/^www\./, "")
        .toLowerCase();
      if (!OWN_HOSTS.some((own) => host === own || host.endsWith(`.${own}`))) hosts.add(host);
    } catch {
      // Skip unparseable URLs.
    }
  }
  return [...hosts];
}

function WriterRecord({ record, failed }) {
  if (failed) {
    return <p className="text-sm text-ink-muted">Writer record unavailable.</p>;
  }
  if (!record) {
    return (
      <p className="text-sm text-ink-muted motion-safe:animate-pulse" role="status">
        Loading writer record…
      </p>
    );
  }

  const { user, articles = [] } = record;
  const joinedDays = ageInDays(user.joined_at);
  const counts = articles.reduce((acc, a) => ({ ...acc, [a.status]: (acc[a.status] || 0) + 1 }), {});
  const isNew = user.joined_at && joinedDays < NEW_ACCOUNT_DAYS;

  return (
    <p className="text-sm leading-relaxed text-ink-muted">
      {user.joined_at && (
        <span className={isNew ? "font-medium text-review-amber-text" : undefined}>
          Joined {formatAge(user.joined_at)}
        </span>
      )}
      <span aria-hidden="true"> · </span>
      <span className="tabular-nums">{plural(articles.length, "article")}</span>
      <span aria-hidden="true"> · </span>
      <span className="tabular-nums">{counts.approved || 0} published</span>
      <span aria-hidden="true"> · </span>
      <span
        className={`tabular-nums ${counts.rejected ? "font-medium text-rejected-red-text" : ""}`}
      >
        {counts.rejected || 0} rejected
      </span>
    </p>
  );
}

function Fact({ label, children }) {
  return (
    <div className="min-w-0">
      <dt className="text-xs text-ink-muted">{label}</dt>
      <dd className="mt-0.5 truncate text-sm text-ink">{children}</dd>
    </div>
  );
}

export default function ArticleReviewDialog({ article: initial, onClose, onDecide }) {
  const [details, setDetails] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const [coverFailed, setCoverFailed] = useState(false);
  const [record, setRecord] = useState(null);
  const [recordFailed, setRecordFailed] = useState(false);

  useEffect(() => {
    let active = true;
    adminApi
      .getArticleDetails(initial.id)
      .then((res) => active && setDetails(res.data.data))
      .catch(() => active && setLoadError(true));
    return () => {
      active = false;
    };
  }, [initial.id]);

  const authorId = details?.author_id ?? initial.author_id;
  useEffect(() => {
    if (!authorId) return;
    let active = true;
    adminApi
      .getUserDetails(authorId)
      .then((res) => active && setRecord(res.data.data))
      .catch(() => active && setRecordFailed(true));
    return () => {
      active = false;
    };
  }, [authorId]);

  const article = { ...initial, ...details };
  const hosts = details
    ? outboundHosts(article.introduction || "", article.content || "", article.summary || "")
    : [];
  const summary = article.summary ? stripMarkdown(article.summary) : null;
  const loading = !details && !loadError;

  const decide = (type) => onDecide(type, article);

  const footer = (
    <>
      <button
        type="button"
        onClick={() => decide("delete")}
        className={`${BTN_GHOST} hover:bg-rejected-red-bg hover:text-rejected-red-text sm:mr-auto`}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
        Delete
      </button>
      {article.status === "approved" && (
        <button type="button" onClick={() => decide("reject")} className={BTN_SECONDARY}>
          <EyeOff className="h-4 w-4" aria-hidden="true" />
          Unpublish
        </button>
      )}
      {article.status === "pending" && (
        <button type="button" onClick={() => decide("reject")} className={BTN_SECONDARY}>
          <X className="h-4 w-4" aria-hidden="true" />
          Reject
        </button>
      )}
      {article.status !== "approved" && (
        <button type="button" onClick={() => decide("approve")} className={BTN_PRIMARY}>
          <Check className="h-4 w-4" aria-hidden="true" />
          Approve and publish
        </button>
      )}
    </>
  );

  return (
    <AdminDialog
      title={DIALOG_TITLE[article.status] || "Article"}
      description={
        article.status === "pending"
          ? `Waiting for a decision · created ${formatAge(article.created_at)}`
          : undefined
      }
      onClose={onClose}
      size="lg"
      footer={footer}
    >
      <div className="flex flex-wrap items-center gap-2">
        <StatusPill status={article.status} />
        {article.category && (
          <span className="text-sm font-medium text-moss-700">{article.category}</span>
        )}
      </div>

      <h3 className="mt-3 text-balance font-editorial text-2xl leading-snug text-ink">
        {capitalizeFirstLetter(article.title)}
      </h3>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <MemberAvatar name={article.author_name} src={article.author_avatar} size="sm" />
        <div className="min-w-0 flex-1 text-sm">
          {article.author_id ? (
            <Link to={`/admin/users/${article.author_id}`} className={`${LINK} text-ink`}>
              {article.author_name}
            </Link>
          ) : (
            <span className="font-medium text-ink">{article.author_name}</span>
          )}
          {article.author_email && (
            <span className="block truncate text-ink-muted">{article.author_email}</span>
          )}
        </div>
        <Link
          to={`/admin/articles/${article.id}`}
          className={`${LINK} inline-flex items-center gap-1 text-sm`}
        >
          Read the full article
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-3">
        <WriterRecord record={record} failed={recordFailed || (!authorId && !loading)} />
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4 border-y border-hairline py-3 sm:grid-cols-4">
        <Fact label="Created">{formatDate(article.created_at)}</Fact>
        <Fact label="Published">
          {article.published_at ? formatDate(article.published_at) : "Not yet"}
        </Fact>
        <Fact label="Reads">
          <span className="tabular-nums">{formatCount(article.views ?? 0)}</span>
        </Fact>
        <Fact label="Links out">
          {details ? (
            <span className={`tabular-nums ${hosts.length ? "font-medium text-review-amber-text" : ""}`}>
              {hosts.length ? plural(hosts.length, "site") : "None"}
            </span>
          ) : (
            "…"
          )}
        </Fact>
      </dl>

      {hosts.length > 0 && (
        <p className="mt-3 text-sm text-ink-muted">
          Links to{" "}
          <span className="break-all text-ink">{hosts.slice(0, 3).join(", ")}</span>
          {hosts.length > 3 && ` and ${hosts.length - 3} more`}.
        </p>
      )}

      <div className="mt-5">
        <h4 className="text-sm font-semibold text-ink">Summary</h4>
        {loading && !summary ? (
          <div className="mt-2 space-y-2 motion-safe:animate-pulse" role="status">
            <span className="sr-only">Loading summary</span>
            <div className="h-3.5 w-full rounded bg-ink/[0.06]" />
            <div className="h-3.5 w-5/6 rounded bg-ink/[0.06]" />
            <div className="h-3.5 w-2/3 rounded bg-ink/[0.06]" />
          </div>
        ) : (
          <p className="mt-1.5 max-w-[65ch] text-[0.9375rem] leading-relaxed text-ink-muted">
            {summary || "No summary."}
          </p>
        )}
      </div>

      {article.image_url && !coverFailed && (
        <img
          src={article.image_url}
          alt=""
          onError={() => setCoverFailed(true)}
          className="mt-5 h-40 w-full rounded-lg bg-ink/[0.05] object-cover"
        />
      )}

      {loadError && (
        <p className="mt-4 text-sm text-rejected-red-text" role="alert">
          Couldn't load the full record. You can still decide from what's shown, or open the article.
        </p>
      )}
    </AdminDialog>
  );
}
