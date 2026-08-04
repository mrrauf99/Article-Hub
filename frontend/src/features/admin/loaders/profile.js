import { apiClient } from "../../api/apiClient.js";
import { adminApi } from "../../api/adminApi.js";
import { handleLoaderError } from "@/utils/loaderError.js";
import { redirectToDashboard } from "@/utils/authUtils.js";

export default async function profileLoader() {
  try {
    const [profileResponse, pendingResponse] = await Promise.all([
      apiClient.get("user/summary"),
      adminApi.getPendingArticles().catch(() => ({ data: { data: [] } })),
    ]);

    const user = profileResponse.data.data;

    // Redirect non-admin users
    if (user.role !== "admin") {
      return redirectToDashboard(user.role);
    }

    const pendingCount = pendingResponse.data.data?.length || 0;

    return { user, pendingCount };
  } catch (error) {
    return handleLoaderError(error, {
      fallbackMessage: "Failed to load profile.",
    });
  }
}
