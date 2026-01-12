import { apiClient } from "../../api/apiClient";

export default async function articleDetailLoader({ params }) {
  const { id, article_id } = params;
  const articleId = id || article_id;

  try {
    const { data } = await apiClient.get(`articles/${articleId}`);

    if (!data.success) {
      return { article: null };
    }

    const article = {
      id: articleId,
      ...data.data,
      image_url: data.data.imageUrl || data.data.image_url,
    };

    apiClient.post(`articles/${articleId}/view`).catch(() => {});

    return { article };
  } catch (error) {
    throw new Response(error.response?.data?.message || "Article not found", {
      status: error.response?.status || 500,
    });
  }
}
