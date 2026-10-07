import { redirect } from "react-router-dom";
import { savedArticlesApi } from "@/features/api/savedArticlesApi";
import { handleLoaderError } from "@/utils/loaderError";

export default async function savedArticlesLoader({ request }) {
  const url = new URL(request.url);
  const page = Math.max(parseInt(url.searchParams.get("page")) || 1, 1);

  try {
    const { data } = await savedArticlesApi.getAll({ page, limit: 9 }, request.signal);
    const lastPage = Math.max(data.data.pagination.totalPages, 1);
    if (page > lastPage) {
      url.searchParams.set("page", String(lastPage));
      return redirect(`${url.pathname}${url.search}`);
    }
    return { ...data.data, error: null };
  } catch (error) {
    if (error.response?.status === 401) return handleLoaderError(error);
    return {
      articles: [],
      pagination: null,
      error: error.response?.data?.message || "We couldn't load your saved articles. Please try again.",
    };
  }
}
