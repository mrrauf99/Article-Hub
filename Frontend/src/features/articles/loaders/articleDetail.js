import { apiClient } from "../../api/apiClient";

export default async function articleDetailLoader({ params, request }) {
  const { id } = params;

  try {
    const { data } = await apiClient.get(`/api/articles/${id}`);

    if (!data.success) {
      return {
        article: null,
      };
    }

    // Increment view count in background (don't await - fire and forget)
    // The backend will check if user is admin and skip incrementing
    apiClient.post(`/api/articles/${id}/view`).catch(() => {
      // Silent fail - view count is not critical
    });

    return { article: data.data };
  } catch (error) {
    throw new Response(error.response?.data?.message || "Article not found", {
      status: error.response?.status || 500,
    });
  }
}
