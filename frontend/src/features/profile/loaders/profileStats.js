import { apiClient } from "../../api/apiClient";
import { handleLoaderError } from "@/utils/loaderError";

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
    return handleLoaderError(err, { fallbackMessage: "Failed to load profile." });
  }
}
