import { apiClient } from "../../api/apiClient";

export default async function articleDetailLoader({ params }) {
  // Accept both 'id' and 'article_id' as parameter names
  const { id, article_id } = params;
  const articleId = id || article_id;

  try {
    const { data } = await apiClient.get(`articles/${articleId}`);

    if (!data.success) {
      return {
        article: null,
      };
    }

    // Ensure article has an id field
    const article = {
      id: articleId,
      ...data.data,
    };

    // Increment view count in background (don't await - fire and forget)
    // The backend will check if user is admin and skip incrementing
    apiClient.post(`articles/${articleId}/view`).catch(() => {
      // Silent fail - view count is not critical
    });

    return { article };
  } catch (error) {
    throw new Response(error.response?.data?.message || "Article not found", {
      status: error.response?.status || 500,
    });
  }
}
