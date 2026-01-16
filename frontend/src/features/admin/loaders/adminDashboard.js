import { adminApi } from "../../api/adminApi.js";
import { handleLoaderError } from "../utils/loaderHelpers.js";

export default async function adminDashboardLoader() {
  try {
    const statsResponse = await adminApi.getDashboardSummary();
    return { stats: statsResponse.data.data.stats };
  } catch (error) {
    return handleLoaderError(error, "Failed to load dashboard");
  }
}
