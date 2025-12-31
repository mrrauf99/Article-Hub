import { adminApi } from "../../api/adminApi.js";
import { handleLoaderError } from "../utils/loaderHelpers.js";

export default async function adminDashboardLoader() {
  try {
    const response = await adminApi.getDashboardStats();
    return { dashboardData: response.data.data };
  } catch (error) {
    return handleLoaderError(error, "Failed to load dashboard");
  }
}
