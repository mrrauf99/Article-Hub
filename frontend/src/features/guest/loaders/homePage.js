import { apiClient } from "@/features/api/apiClient.js";
import publicArticlesLoader from "@/features/articles/loaders/publicArticles.js";
import { redirectToDashboard } from "@/utils/authUtils.js";

/**
 * Redirects authenticated users to dashboard, loads articles for guests
 */
export default async function homePageLoader() {
  try {
    const { data } = await apiClient.get("user/profile");

    if (data.success && data.data?.role) {
      return redirectToDashboard(data.data.role);
    }
  } catch {
    // Not authenticated - continue to load articles
  }

  return publicArticlesLoader();
}
