import { useCallback, useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Inbox } from "lucide-react";

import PageHeader from "@/features/user/components/PageHeader";
import EmptyState from "@/features/user/components/EmptyState";
import { BTN_SECONDARY_SM } from "@/styles/panelClasses";
import ReviewQueue from "../components/ReviewQueue";
import PlatformLedger from "../components/PlatformLedger";
import NewestMembers from "../components/NewestMembers";
import RecentSubmissions from "../components/RecentSubmissions";
import ArticleReviewDialog from "../components/ArticleReviewDialog";
import ActionNotice from "../components/ActionNotice";
import useArticleModeration from "../hooks/useArticleModeration";
import { formatAge, plural } from "../utils/format";

const QUEUE_PAGE = 12;

function summaryLine(queue) {
  if (queue.length === 0) {
    return "Nothing is waiting for a decision.";
  }
  const oldest = queue[0];
  return `${plural(queue.length, "article")} waiting for a decision, oldest first. The oldest was created ${formatAge(oldest.created_at)}.`;
}

export default function AdminDashboardPage() {
  const { stats, recentArticles = [], recentUsers = [], queue = [] } = useLoaderData();
  const [reviewing, setReviewing] = useState(null);
  const [limit, setLimit] = useState(QUEUE_PAGE);
  const [rows, setRows] = useState(() => queue.slice(0, QUEUE_PAGE));
  const rowsRef = useRef(rows);
  rowsRef.current = rows;
  const [focusTarget, setFocusTarget] = useState(null);

  // Move focus to a neighbouring row (or the notice) before the decided row collapses.
  const onSuccess = useCallback((_type, article) => {
    const list = rowsRef.current;
    const i = list.findIndex((r) => String(r.id) === String(article.id));
    const next = i === -1 ? null : list[i + 1] ?? list[i - 1] ?? null;
    setFocusTarget({ id: next ? String(next.id) : null, at: Date.now() });
  }, []);
  const moderation = useArticleModeration({ onSuccess });
  const [leavingId, setLeavingId] = useState(null);
  const decidedRef = useRef(null);

  useEffect(() => {
    if (moderation.submittingId) decidedRef.current = moderation.submittingId;
  }, [moderation.submittingId]);

  // Keep the decided row mounted long enough to animate its collapse.
  useEffect(() => {
    const next = queue.slice(0, limit);
    const decided = decidedRef.current;
    const wasShown = decided && rows.some((r) => String(r.id) === decided);
    const isGone = decided && !queue.some((r) => String(r.id) === decided);

    if (!wasShown || !isGone) {
      setLeavingId(null);
      setRows(next);
      return;
    }

    decidedRef.current = null;
    setLeavingId(decided);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const id = setTimeout(() => {
      setLeavingId(null);
      setRows(next);
    }, reduce ? 0 : 320);
    return () => clearTimeout(id);
  }, [queue, limit]); // rows is read as the pre-update snapshot on purpose

  // Cleared after focusing so the periodic refresh never steals focus.
  useEffect(() => {
    if (!focusTarget?.id) return;
    const el = document.querySelector(`[data-queue-title="${focusTarget.id}"]`);
    if (el) {
      el.focus();
      setFocusTarget(null);
    }
  }, [focusTarget, rows]);

  const remaining = queue.length - rows.length;
  const showMore = () => {
    const firstNew = queue[rows.length];
    setLimit((n) => n + QUEUE_PAGE);
    if (firstNew) setFocusTarget({ id: String(firstNew.id), at: Date.now() });
  };

  const decide = (type, article) => {
    setReviewing(null);
    moderation.open(type, article);
  };

  return (
    <>
      <PageHeader
        title="Review queue"
        description={summaryLine(queue)}
      />

      <div className="mt-8">
        <ActionNotice
          notice={moderation.notice}
          onDismiss={moderation.dismissNotice}
          focusOnShow={Boolean(focusTarget) && !focusTarget.id}
        />
      </div>

      <div className="grid gap-12 xl:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="min-w-0">
          {rows.length === 0 ? (
            <div className="border-y border-hairline">
              <EmptyState compact icon={Inbox} title="The queue is clear">
                New submissions appear here, oldest first, with Approve and Reject beside
                each one.
              </EmptyState>
            </div>
          ) : (
            <>
              <ReviewQueue
                articles={rows}
                onReview={setReviewing}
                onDecide={decide}
                submittingId={moderation.submittingId}
                leavingId={leavingId}
              />
              {remaining > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-muted">
                  <button type="button" onClick={showMore} className={BTN_SECONDARY_SM}>
                    Show {Math.min(QUEUE_PAGE, remaining)} more
                  </button>
                  <span>
                    <span className="tabular-nums">{rows.length}</span> of{" "}
                    <span className="tabular-nums">{queue.length}</span> shown, oldest first
                  </span>
                </div>
              )}
            </>
          )}

          <RecentSubmissions articles={recentArticles} onReview={setReviewing} />
        </div>

        <aside className="grid gap-12 sm:grid-cols-2 xl:block xl:space-y-12 xl:border-l xl:border-hairline xl:pl-8">
          <PlatformLedger stats={stats} />
          <NewestMembers users={recentUsers} />
        </aside>
      </div>

      {reviewing && (
        <ArticleReviewDialog
          article={reviewing}
          onClose={() => setReviewing(null)}
          onDecide={decide}
        />
      )}
      {moderation.dialog}
    </>
  );
}
