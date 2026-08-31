import publicArticlesLoader from "@/features/articles/loaders/publicArticles.js";

// Auth redirect for logged-in users is handled by the parent publicLayoutLoader, not here.
export default async function homePageLoader({ request }) {
  try {
    const articlesResult = await publicArticlesLoader({ request });
    return articlesResult;
  } catch {
    throw new Response("Failed to load articles", { status: 500 });
  }
}
