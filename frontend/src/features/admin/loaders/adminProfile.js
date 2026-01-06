import { redirect } from "react-router-dom";
import { apiClient } from "../../api/apiClient.js";

export default async function adminProfileLoader() {
  try {
    const response = await apiClient.get("user/profile");
    const user = response.data.data;

    // Redirect non-admin users
    if (user.role !== "admin") {
      return redirect("/user/dashboard");
    }

    return { user };
  } catch (error) {
    if (error.response?.status === 401) {
      return redirect("/login");
    }
    throw new Response("Failed to load profile", { status: 500 });
  }
}
