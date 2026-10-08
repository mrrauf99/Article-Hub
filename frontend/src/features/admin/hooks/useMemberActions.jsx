import { useCallback, useEffect, useRef, useState } from "react";
import { useFetcher } from "react-router-dom";

import ConfirmDialog from "@/components/ConfirmDialog";
import { plural } from "../utils/format";

const displayName = (member) => member.name || member.username;

export default function useMemberActions({ onSuccess, initialNotice = null } = {}) {
  const fetcher = useFetcher();
  const [request, setRequest] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(initialNotice);
  const submittedRef = useRef(null);

  const busy = fetcher.state !== "idle";

  const open = useCallback((type, member) => {
    setRequest({ type, member });
    setError(null);
  }, []);

  const close = useCallback(() => {
    if (busy) return;
    setRequest(null);
    setError(null);
  }, [busy]);

  const dismissNotice = useCallback(() => setNotice(null), []);

  const submit = (payload, meta) => {
    submittedRef.current = meta;
    setError(null);
    fetcher.submit(payload, { method: "post", action: "/admin/users" });
  };

  useEffect(() => {
    const done = submittedRef.current;
    if (fetcher.state !== "idle" || !fetcher.data || !done) return;
    submittedRef.current = null;

    if (fetcher.data.success) {
      const name = displayName(done.member);
      const count = Number(done.member.article_count) || 0;
      const text = `Deleted ${name}${count ? ` and ${plural(count, "article")}` : ""}.`;
      setRequest(null);
      setNotice({ id: Date.now(), text });
      onSuccess?.(done.type, done.member, text);
    } else {
      setError(fetcher.data.message || "That didn't save. Try again in a moment.");
    }
  }, [fetcher.state, fetcher.data, onSuccess]);

  const member = request?.member;
  const articleCount = Number(member?.article_count) || 0;

  const dialog = (
    <ConfirmDialog
      isOpen={request?.type === "delete"}
      title="Delete this writer?"
      message={
        member
          ? `${displayName(member)}'s account${
              articleCount ? ` and ${plural(articleCount, "article")} they wrote` : ""
            } will be permanently deleted, including uploaded images. This can't be undone.`
          : ""
      }
      confirmMatchText={member?.username}
      confirmMatchLabel="Type the username to confirm"
      confirmMatchHelper={
        member ? (
          <>
            Enter "<span className="font-bold text-ink">{member.username}</span>"
          </>
        ) : (
          ""
        )
      }
      confirmText="Delete writer"
      cancelText="Cancel"
      variant="danger"
      isLoading={busy}
      loadingText="Deleting"
      error={request?.type === "delete" ? error : null}
      onConfirm={() => submit({ intent: "delete", userId: member.id }, { type: "delete", member })}
      onCancel={close}
    />
  );

  return { open, dialog, notice, dismissNotice, busy };
}
