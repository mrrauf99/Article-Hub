import { apiClient } from "../../api/apiClient";

export default async function articleDetailLoader({ params, request }) {
  const { id, article_id } = params;
  const articleId = id || article_id;

  const url = new URL(request?.url || window.location.href);
  const isAdminRoute = url.pathname.startsWith("/admin/");

  try {
    const endpoint = isAdminRoute
      ? `admin/articles/${articleId}`
      : `articles/${articleId}`;

    const { data } = await apiClient.get(endpoint);

    if (!data?.success) {
      return { article: null };
    }

    const raw = data.data || {};
    const article = {
      id: articleId,
      ...raw,
      image_url: raw.imageUrl || raw.image_url,
    };

    // Only increment views on public/user routes
    if (!isAdminRoute) {
      apiClient.post(`articles/${articleId}/view`).catch(() => {});
    }

    return { article };
  } catch (error) {
    throw new Response(error.response?.data?.message || "Article not found", {
      status: error.response?.status || 500,
    });
  }
}
