import { apiClient } from "../../api/apiClient";
import { getCanonicalCategory, normalizeCategory } from "@/utils/categoryUtils";

const DEFAULT_LIMIT = 9;

export default async function publicArticlesLoader(request) {
  try {
    const url = request?.url ? new URL(request.url) : null;
    const pageParam = url ? Number(url.searchParams.get("page")) || 1 : 1;
    const rawCategory = url ? url.searchParams.get("category") : null;
    const category = rawCategory ? getCanonicalCategory(rawCategory) : null;

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
