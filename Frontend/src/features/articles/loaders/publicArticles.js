import { apiClient } from "../../api/apiClient";

export async function publicArticlesLoader({ request }) {
  const url = new URL(request.url);
  const category = url.searchParams.get("category");

  try {
    const res = await apiClient.get("/api/articles", {
      params: category && category !== "All" ? { category } : {},
    });

    return res.data.data;
  } catch (error) {
    console.error("articlesLoader error:", error);

    throw new Response("Failed to load articles", {
      status: 500,
    });
  }
}
