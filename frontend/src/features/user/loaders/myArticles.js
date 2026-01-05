import { apiClient } from "../../api/apiClient";
import { redirect } from "react-router-dom";

export default async function myArticlesLoader() {
  try {
    // Fetch both articles and stats in parallel
    const [articlesRes, statsRes] = await Promise.all([
      apiClient.get("/api/articles/me"),
      apiClient.get("/api/user/stats"),
    ]);

    return {
      success: articlesRes.data.success,
      articles: articlesRes.data.data,
      stats: statsRes.data.data,
    };
  } catch {
    throw redirect("/login");
  }
}
