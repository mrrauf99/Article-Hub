import publicArticlesLoader from "@/features/articles/loaders/publicArticles.js";

export default function homePageLoader({ request }) {
  return { articlesPromise: publicArticlesLoader({ request }) };
}
