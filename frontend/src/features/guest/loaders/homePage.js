import publicArticlesLoader from "@/features/articles/loaders/publicArticles.js";
import { redirectToDashboard } from "@/utils/authUtils.js";
import { authApi } from "@/features/api/authApi.js";

/**
 * Redirects authenticated users to dashboard, loads articles for guests
 * Uses session to check current auth status
 * If role was changed by admin, user's old session will be destroyed
 * forcing them to login again with new role
 */
export default async function homePageLoader({ request }) {
  try {
    const { data } = await authApi.session();
    if (data.success && data.role) {
      return redirectToDashboard(data.role);
    }
  } catch {
    // Not authenticated - continue to load articles
  }

  return publicArticlesLoader(request);
}
