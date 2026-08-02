import { adminApi } from "../../api/adminApi.js";
import { getQueryParams } from "../utils/loaderHelpers.js";
import { handleLoaderError } from "@/utils/loaderError.js";

const DEFAULT_LIMIT = 9;

export default async function articlesLoader({ request }) {
  const params = getQueryParams(request, {
    status: "all",
    search: "",
    page: "1",
  });

  try {
    const response = await adminApi.getAllArticles({
      ...params,
      limit: DEFAULT_LIMIT,
    });
    return {
      articles: response.data.data.articles,
      pagination: response.data.data.pagination,
      filters: { status: params.status, search: params.search },
    };
  } catch (error) {
    return handleLoaderError(error, { fallbackMessage: "Failed to load articles.", forbiddenRedirect: "/user/dashboard" });
  }
}
