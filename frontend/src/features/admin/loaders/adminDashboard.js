import { adminApi } from "../../api/adminApi.js";
import { handleLoaderError } from "../utils/loaderHelpers.js";

export default async function adminDashboardLoader() {
  try {
    const response = await adminApi.getDashboardStats();
    const { stats, recentArticles, recentUsers } = response.data.data;
    return { stats, recentArticles, recentUsers };
  } catch (error) {
    return handleLoaderError(error, "Failed to load dashboard");
  }
}
