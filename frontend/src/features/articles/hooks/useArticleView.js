import { useEffect, useRef } from "react";
import { useMatches } from "react-router-dom";
import { apiClient } from "@/features/api/apiClient";

export default function useArticleView(article, enabled = true) {
  const isAuthenticated = useMatches().some((match) => match.data?.user?.role);
  const countedId = useRef(null);
  useEffect(() => {
    if (!enabled || !isAuthenticated || article?.status !== "approved" || countedId.current === article.id) return;
    countedId.current = article.id;
    apiClient.post(`articles/${article.id}/view`).catch(() => {});
  }, [article?.id, article?.status, enabled, isAuthenticated]);
}
