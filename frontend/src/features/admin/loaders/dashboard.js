import { adminApi } from "../../api/adminApi.js";
import { handleLoaderError } from "@/utils/loaderError.js";

export default async function dashboardLoader() {
  try {
    const [statsResponse, queueResponse] = await Promise.all([
      adminApi.getDashboardStats(),
      adminApi.getPendingArticles(),
    ]);
    const { stats, recentArticles, recentUsers } = statsResponse.data.data;
    return { stats, recentArticles, recentUsers, queue: queueResponse.data.data ?? [] };
  } catch (error) {
    return handleLoaderError(error, { fallbackMessage: "Couldn't load the review queue." });
  }
}
