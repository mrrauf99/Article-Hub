import { apiClient } from "../features/api/apiClient";

/**
 * Loader for PublicLayout - checks if user is authenticated
 * Returns user data if logged in, null if not
 * Does NOT redirect - allows viewing public pages while logged in
 */
export default async function publicLayoutLoader() {
  try {
    const { data } = await apiClient.get("user/profile");

    if (data.success) {
      return { user: data.data };
    }

    return { user: null };
  } catch {
    // Not authenticated - that's fine for public pages
    return { user: null };
  }
}
