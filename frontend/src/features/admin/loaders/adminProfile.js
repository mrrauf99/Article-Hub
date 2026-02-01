import { redirect } from "react-router-dom";
import { apiClient } from "../../api/apiClient.js";
import { adminApi } from "../../api/adminApi.js";

export default async function adminProfileLoader() {
  try {
    const [profileResponse, pendingResponse] = await Promise.all([
      apiClient.get("user/profile"),
      adminApi.getPendingArticles().catch(() => ({ data: { data: [] } })),
    ]);

    const user = profileResponse.data.data;

    // Redirect non-admin users
    if (user.role !== "admin") {
      return redirect("/user/dashboard");
    }

    const pendingCount = pendingResponse.data.data?.length || 0;

    return { user, pendingCount };
  } catch (error) {
    if (error.response?.status === 401) {
      return redirect("/login");
    }
    throw new Response("Failed to load profile", { status: 500 });
  }
}
