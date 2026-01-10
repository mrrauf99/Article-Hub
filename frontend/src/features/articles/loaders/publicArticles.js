import { apiClient } from "../../api/apiClient";

import { normalizeCategory } from "@/utils/categoryUtils";

export default async function publicArticlesLoader() {
  try {
    const res = await apiClient.get("articles");

    const articles = res.data.data.map((article) => ({
      ...article,
      category: normalizeCategory(article.category) || article.category,
    }));

    return { articles };
  } catch (error) {
    console.error("articlesLoader error:", error);

    throw new Response("Failed to load articles", {
      status: 500,
    });
  }
}
