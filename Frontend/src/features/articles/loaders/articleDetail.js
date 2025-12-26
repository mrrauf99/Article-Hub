import { apiClient } from "../../api/apiClient";

export default async function articleDetailLoader({ params }) {
  const { id } = params;

  try {
    const { data } = await apiClient.get(`/api/articles/${id}`);

    if (!data.success) {
      return {
        article: null,
      };
    }

    return { article: data.data };
  } catch (error) {
    throw new Response(error.response?.data?.message || "Article not found", {
      status: error.response?.status || 500,
    });
  }
}
