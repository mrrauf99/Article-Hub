import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Check, EyeOff, Trash2, X } from "lucide-react";

import StatusPill from "@/features/user/components/StatusPill";
import { BTN_GHOST_SM, BTN_PRIMARY_SM, BTN_SECONDARY_SM } from "@/styles/panelClasses";
import ActionNotice from "./ActionNotice";
import useArticleModeration from "../hooks/useArticleModeration";

const PROMPT = {
  pending: "Waiting for a decision.",
  approved: "Live on Article Hub.",
  rejected: "Returned to the author.",
};

export default function AdminDecisionBar({ article }) {
  const navigate = useNavigate();
  const onSuccess = useCallback(
    (type) => {
      if (type === "delete") navigate("/admin/articles", { replace: true });
    },
    [navigate],
  );
  const moderation = useArticleModeration({ onSuccess });
  const busy = moderation.busy;

  return (
    <>
      <ActionNotice notice={moderation.notice} onDismiss={moderation.dismissNotice} />

      <div className="mb-8 flex flex-col gap-3 rounded-xl border border-hairline bg-paper-raised px-4 py-3 sm:flex-row sm:items-center">
        <div className="flex flex-1 items-center gap-3 text-sm text-ink-muted">
          <StatusPill status={article.status} />
          <span>{PROMPT[article.status]}</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => moderation.open("delete", article)}
            disabled={busy}
            className={`${BTN_GHOST_SM} hover:bg-rejected-red-bg hover:text-rejected-red-text`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
            Delete
          </button>
          {article.status !== "rejected" && (
            <button
              type="button"
              onClick={() => moderation.open("reject", article)}
              disabled={busy}
              className={BTN_SECONDARY_SM}
            >
              {article.status === "approved" ? (
                <>
                  <EyeOff className="h-4 w-4" aria-hidden="true" />
                  Unpublish
                </>
              ) : (
                <>
                  <X className="h-4 w-4" aria-hidden="true" />
                  Reject
                </>
              )}
            </button>
          )}
          {article.status !== "approved" && (
            <button
              type="button"
              onClick={() => moderation.open("approve", article)}
              disabled={busy}
              className={BTN_PRIMARY_SM}
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Approve and publish
            </button>
          )}
        </div>
      </div>

      {moderation.dialog}
    </>
  );
}
