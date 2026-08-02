import { apiClient } from "../../api/apiClient";
import { handleLoaderError } from "@/utils/loaderError";

export default async function articleDetailLoader({ params, request }) {
  const { id } = params;
  const isAdminRoute = new URL(request.url).pathname.startsWith("/admin");

  try {
    const endpoint = isAdminRoute ? `admin/articles/${id}` : `articles/${id}`;
    const { data } = await apiClient.get(endpoint);

    if (!data?.success || !data?.data) {
      throw new Response("Article not found", { status: 404 });
    }

    const article = data.data;

    // Only increment views on public/user routes
    if (!isAdminRoute) {
      apiClient.post(`articles/${id}/view`).catch(() => {});
    }

    return { article };
  } catch (error) {
    return handleLoaderError(error, {
      forbiddenRedirect: "/",
      fallbackMessage: error?.response?.data?.message || "Article not found.",
    });
  }
}
