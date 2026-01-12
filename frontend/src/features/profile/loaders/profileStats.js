import { apiClient } from "../../api/apiClient";
import { redirect } from "react-router-dom";

export default async function profileStatsLoader() {
  try {
    // Fetch both user profile and stats
    const [profileRes, statsRes] = await Promise.all([
      apiClient.get("user/profile"),
      apiClient.get("user/stats"),
    ]);

    return {
      user: profileRes.data.data,
      stats: statsRes.data.data,
    };
  } catch (err) {
    if (err.response?.status === 401) {
      return redirect("/login");
    }
    throw new Response("Failed to load profile", {
      status: err.response?.status || 500,
    });
  }
}
