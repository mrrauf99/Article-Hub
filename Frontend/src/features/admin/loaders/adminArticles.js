import { adminApi } from "../../api/adminApi.js";
import {
  handleLoaderError,
  getQueryParams,
} from "../utils/loaderHelpers.js";

export default async function adminArticlesLoader({ request }) {
  const params = getQueryParams(request, {
    status: "all",
    search: "",
    page: "1",
  });

  try {
    const response = await adminApi.getAllArticles({
      ...params,
      limit: 10,
    });
    return {
      articles: response.data.data.articles,
      pagination: response.data.data.pagination,
      filters: { status: params.status, search: params.search },
    };
  } catch (error) {
    return handleLoaderError(error, "Failed to load articles");
  }
}
