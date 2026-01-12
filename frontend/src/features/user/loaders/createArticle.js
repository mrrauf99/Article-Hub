import { redirect } from "react-router-dom";
import { apiClient } from "../../api/apiClient";

export default async function createArticleLoader() {
  try {
    const { data } = await apiClient.get("user/profile");

    // Redirect admins - they cannot create articles
    if (data.data.role === "admin") {
      return redirect("/admin/dashboard");
    }

    // Allow regular users to create articles
    return {
      user: data.data,
    };
  } catch {
    // Not authenticated - redirect to login
    throw redirect("/login");
  }
}
