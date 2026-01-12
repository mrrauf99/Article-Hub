import { apiClient } from "../features/api/apiClient";

/**
 * Provides authentication context for public pages
 */
export default async function publicLayoutLoader() {
  try {
    const { data } = await apiClient.get("user/profile");
    return { user: data.success ? data.data : null };
  } catch {
    return { user: null };
  }
}
