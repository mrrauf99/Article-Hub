import { authApi } from "../features/api/authApi";
import { redirectToDashboard } from "@/utils/authUtils.js";

/**
 * Provides authentication context for public pages.
 * Uses the lightweight auth status endpoint instead of the
 * full profile endpoint to avoid a heavy 401 round-trip for guests.
 */
export default async function publicLayoutLoader({ request }) {
  const url = new URL(request.url);
  try {
    const { data } = await authApi.checkAuth();
    
    // Redirect authenticated users away from the home page
    if (data.success && data.role && url.pathname === "/") {
      return redirectToDashboard(data.role);
    }
    
    return { user: data.success ? { role: data.role } : null };
  } catch {
    return { user: null };
  }
}
