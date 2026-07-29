import { authApi } from "../features/api/authApi";

/**
 * Provides authentication context for public pages.
 * Uses the lightweight GET /api/auth/me endpoint instead of the
 * full profile endpoint to avoid a heavy 401 round-trip for guests.
 */
export default async function publicLayoutLoader() {
  try {
    const { data } = await authApi.session();
    return { user: data.success ? { role: data.role } : null };
  } catch {
    return { user: null };
  }
}
