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
  const [sessionResult, articlesResult] = await Promise.allSettled([
    authApi.session(),
    publicArticlesLoader({ request }),
  ]);

  if (sessionResult.status === "fulfilled" && sessionResult.value?.data?.success && sessionResult.value?.data?.role) {
    return redirectToDashboard(sessionResult.value.data.role);
  }

  if (articlesResult.status === "fulfilled") {
    return articlesResult.value;
  }

  throw new Response("Failed to load articles", { status: 500 });
}
