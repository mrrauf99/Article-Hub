import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router-dom";
import { EyeOff, X } from "lucide-react";

import ConfirmDialog from "@/components/ConfirmDialog";
import { capitalizeFirstLetter } from "@/utils/stringUtils";

const REASON_HELPER = "Sent to the author by email. Article Hub doesn't store it.";

function dialogCopy(type, article) {
  const title = capitalizeFirstLetter(article.title);
  const by = article.author_name ? ` by ${article.author_name}` : "";

  if (type === "approve") {
    return {
      title: "Approve and publish?",
      message: `"${title}"${by} goes live on Article Hub, and the author is emailed.`,
      confirmText: "Approve and publish",
      loadingText: "Publishing",
      variant: "success",
    };
  }
  if (type === "reject" && article.status === "approved") {
    return {
      title: "Unpublish this article?",
      message: `"${title}"${by} comes off the public site and goes back to the author as rejected.`,
      confirmText: "Unpublish",
      loadingText: "Unpublishing",
      variant: "warning",
      icon: EyeOff,
      reasonLabel: "Reason for the author",
      reasonPlaceholder: "Why is it coming down, and what would need to change?",
    };
  }
  if (type === "reject") {
    return {
      title: "Reject this article?",
      message: `"${title}"${by} goes back to the author. They can edit it and submit again.`,
      confirmText: "Reject article",
      loadingText: "Rejecting",
      variant: "warning",
      icon: X,
      reasonLabel: "Reason for the author",
      reasonPlaceholder: "What should the author change before resubmitting?",
    };
  }
  return {
    title: "Delete this article?",
    message: `"${title}"${by} and its cover image are permanently removed. This can't be undone.`,
    confirmText: "Delete article",
    loadingText: "Deleting",
    variant: "danger",
    reasonLabel: "Reason for the author",
    reasonPlaceholder: "Why is this article being removed?",
  };
}

function successText(type, article) {
  const title = `"${capitalizeFirstLetter(article.title)}"`;
  if (type === "approve") return `Approved ${title}. It's live and the author has been emailed.`;
  if (type === "reject" && article.status === "approved") {
    return `Unpublished ${title}. It's off the site and the author has been emailed your reason.`;
  }
  if (type === "reject") return `Rejected ${title}. The author has been emailed your reason.`;
  return `Deleted ${title}. The author has been emailed your reason.`;
}

// Posts to the /admin/articles action; the dialog stays open until the result lands.
export default function useArticleModeration({ onSuccess } = {}) {
  const fetcher = useFetcher();
  const [request, setRequest] = useState(null);
  const [reason, setReason] = useState("");
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const submittedRef = useRef(null);

  const busy = fetcher.state !== "idle";
  const submittingId = busy ? fetcher.formData?.get("articleId") ?? null : null;

  const open = useCallback((type, article) => {
    setRequest({ type, article });
    setReason("");
    setError(null);
  }, []);

  const close = useCallback(() => {
    if (busy) return;
    setRequest(null);
    setError(null);
  }, [busy]);

  const dismissNotice = useCallback(() => setNotice(null), []);

  const confirm = () => {
    if (!request) return;
    const payload = { intent: request.type, articleId: request.article.id };
    if (request.type !== "approve") payload.reason = reason.trim();
    submittedRef.current = request;
    setError(null);
    fetcher.submit(payload, { method: "post", action: "/admin/articles" });
  };

  useEffect(() => {
    const done = submittedRef.current;
    if (fetcher.state !== "idle" || !fetcher.data || !done) return;
    submittedRef.current = null;

    if (fetcher.data.success) {
      setRequest(null);
      setNotice({ id: Date.now(), text: successText(done.type, done.article) });
      onSuccess?.(done.type, done.article);
    } else {
      setError(fetcher.data.message || "The change couldn't be saved. Please try again.");
    }
  }, [fetcher.state, fetcher.data, onSuccess]);

  const copy = request ? dialogCopy(request.type, request.article) : null;

  const dialog = (
    <ConfirmDialog
      isOpen={Boolean(request)}
      title={copy?.title}
      message={copy?.message}
      confirmText={copy?.confirmText}
      cancelText="Cancel"
      variant={copy?.variant}
      icon={copy?.icon}
      isLoading={busy}
      loadingText={copy?.loadingText}
      error={error}
      {...(copy?.reasonLabel
        ? {
            reasonLabel: copy.reasonLabel,
            reasonPlaceholder: copy.reasonPlaceholder,
            reasonHelper: REASON_HELPER,
            reasonValue: reason,
            reasonRequired: true,
            onReasonChange: setReason,
          }
        : {})}
      onConfirm={confirm}
      onCancel={close}
    />
  );

  return { open, dialog, notice, dismissNotice, busy, submittingId };
}
