import { apiClient } from "../../api/apiClient";
import { getCanonicalCategory, normalizeCategory } from "@/utils/categoryUtils";

const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 30;

export default async function publicArticlesLoader(args) {
  try {
    const request = args?.request ?? args;
    const url = request?.url ? new URL(request.url) : null;
    const pageParam = url ? Number(url.searchParams.get("page")) || 1 : 1;
    const rawCategory = url ? url.searchParams.get("category") : null;
    const category = rawCategory ? getCanonicalCategory(rawCategory) : null;
    const loadAll = url
      ? url.pathname.startsWith("/user/articles") ||
        ["1", "true"].includes(url.searchParams.get("all"))
      : false;

    if (loadAll) {
      const firstResponse = await apiClient.get("articles", {
        params: { page: 1, limit: MAX_LIMIT },
      });

      const firstData = firstResponse.data?.data || {};
      const articles = [...(firstData.articles || [])];
      const totalPages = firstData.pagination?.totalPages || 1;

      if (totalPages > 1) {
        const pageRequests = Array.from({ length: totalPages - 1 }, (_, i) =>
          apiClient.get("articles", {
            params: { page: i + 2, limit: MAX_LIMIT },
          }),
        );

        const responses = await Promise.all(pageRequests);
        responses.forEach((response) => {
          const pageArticles = response.data?.data?.articles || [];
          articles.push(...pageArticles);
        });
      }

      const normalized = articles.map((article) => ({
        ...article,
        category: normalizeCategory(article.category) || article.category,
      }));

      const deduped = Array.from(
        new Map(
          normalized.map((article) => [article.article_id, article]),
        ).values(),
      );

      return { articles: deduped };
    }

    const res = await apiClient.get("articles", {
      params: {
        page: pageParam,
        limit: DEFAULT_LIMIT,
        ...(category && category !== "All" ? { category } : {}),
      },
    });

    const articles = res.data.data.articles.map((article) => ({
      ...article,
      category: normalizeCategory(article.category) || article.category,
    }));

    return {
      articles,
      pagination: res.data.data.pagination,
      meta: res.data.data.meta,
    };
  } catch (error) {
    console.error("publicArticlesLoader error:", error);
    throw new Response("Failed to load articles", { status: 500 });
  }
}
