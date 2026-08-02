import { apiClient } from "../../api/apiClient";
import { handleLoaderError } from "@/utils/loaderError";

export default async function myArticlesLoader() {
  try {
    // Fetch both articles and stats in parallel
    const [articlesRes, statsRes] = await Promise.all([
      apiClient.get("articles/me"),
      apiClient.get("user/stats"),
    ]);

    return {
      success: articlesRes.data.success,
      articles: articlesRes.data.data,
      stats: statsRes.data.data,
    };
  } catch (error) {
    return handleLoaderError(error, { fallbackMessage: "Failed to load articles." });
  }
}
