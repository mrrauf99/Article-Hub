import { useId, useRef } from "react";
import { useFetcher, useMatches, useNavigate } from "react-router-dom";
import { Bookmark, BookmarkCheck, LoaderCircle } from "lucide-react";
import { BTN_SECONDARY } from "@/styles/panelClasses";

export default function SaveArticleButton({ article }) {
  const matches = useMatches();
  const user = matches.find((match) => match.data?.user)?.data.user;

  const fetcher = useFetcher({ key: `saved-article-${user?.id || user?.role || "guest"}-${article.id}` });
  const navigate = useNavigate();
  const errorId = useId();
  const submitting = useRef(false);
  const pending = fetcher.state !== "idle";
  if (!pending) submitting.current = false;

  const isSaved = fetcher.state === "loading" && fetcher.data?.success
    ? fetcher.data.data.is_saved
    : Boolean(article.is_saved);
  const error = !pending && fetcher.data?.success === false ? fetcher.data.message : null;
  const Icon = pending ? LoaderCircle : isSaved ? BookmarkCheck : Bookmark;

  if (user?.role === "admin") {
    return null;
  }

  function toggleSaved(event) {
    event.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }
    if (pending || submitting.current) return;
    submitting.current = true;
    fetcher.submit(null, {
      method: isSaved ? "delete" : "post",
      action: `/saved-articles/${article.id}`,
    });
  }

  return (
    <div className="relative z-10 max-w-full">
      <button
        type="button"
        onClick={toggleSaved}
        disabled={pending}
        aria-pressed={isSaved}
        aria-label={`${isSaved ? "Unsave" : "Save"} ${article.title}`}
        aria-describedby={error ? errorId : undefined}
        aria-busy={pending}
        className={`${BTN_SECONDARY} ${isSaved ? "text-moss-800" : ""}`}
      >
        <Icon className={`h-4 w-4 ${pending ? "motion-safe:animate-spin" : ""}`} aria-hidden="true" />
        {pending ? (fetcher.formMethod === "DELETE" ? "Removing…" : "Saving…") : isSaved ? "Saved" : "Save"}
      </button>
      {error && <p id={errorId} role="alert" className="mt-2 max-w-xs text-sm text-red-700">{error}</p>}
    </div>
  );
}
