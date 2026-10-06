import { apiClient } from "../../api/apiClient";
import { handleLoaderError } from "@/utils/loaderError";

export default async function articleDetailLoader({ params, request }) {
  const { id } = params;
  const isAdminRoute = new URL(request.url).pathname.startsWith("/admin");

  try {
    const endpoint = isAdminRoute ? `admin/articles/${id}` : `articles/${id}`;
    const { data } = await apiClient.get(endpoint);

    if (!data?.success || !data?.data) {
      throw new Response("We couldn't find that article.", { status: 404 });
    }

    const article = data.data;

    return { article };
  } catch (error) {
    return handleLoaderError(error, {
      forbiddenRedirect: "/",
      fallbackMessage: error?.response?.data?.message || "We couldn't find that article.",
    });
  }
}
