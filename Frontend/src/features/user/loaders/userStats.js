import { apiClient } from "../../api/apiClient";

export default async function userStatsLoader() {
  try {
    const { data } = await apiClient.get("api/user/stats");

    return {
      stats: data.data,
    };
  } catch (err) {
    throw new Response("Failed to load user stats", {
      status: err.response.status,
    });
  }
}
