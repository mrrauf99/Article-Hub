import publicArticlesLoader from "@/features/articles/loaders/publicArticles.js";

/**
 * Loads articles for guests.
 * Redirection for authenticated users is handled by the parent publicLayoutLoader.
 */
export default async function homePageLoader({ request }) {
  try {
    const articlesResult = await publicArticlesLoader({ request });
    return articlesResult;
  } catch {
    throw new Response("Failed to load articles", { status: 500 });
  }
}
