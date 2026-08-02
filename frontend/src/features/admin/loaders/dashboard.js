import { adminApi } from "../../api/adminApi.js";
import { handleLoaderError } from "@/utils/loaderError.js";

export default async function dashboardLoader() {
  try {
    const response = await adminApi.getDashboardStats();
    const { stats, recentArticles, recentUsers } = response.data.data;
    return { stats, recentArticles, recentUsers };
  } catch (error) {
    return handleLoaderError(error, { fallbackMessage: "Failed to load dashboard." });
  }
}
