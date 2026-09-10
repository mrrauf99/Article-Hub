import { adminApi } from "../../api/adminApi.js";
import { getQueryParams } from "../utils/loaderHelpers.js";
import { handleLoaderError } from "@/utils/loaderError.js";

const PAGE_SIZE = 20;

export default async function articlesLoader({ request }) {
  const params = getQueryParams(request, {
    status: "all",
    search: "",
    page: "1",
  });

  try {
    const [listResponse, summaryResponse] = await Promise.all([
      adminApi.getAllArticles({ ...params, limit: PAGE_SIZE }),
      adminApi.getDashboardSummary(),
    ]);
    const { stats } = summaryResponse.data.data;
    return {
      articles: listResponse.data.data.articles,
      pagination: listResponse.data.data.pagination,
      filters: { status: params.status, search: params.search },
      counts: {
        all: Number(stats.total_articles) || 0,
        pending: Number(stats.pending_articles) || 0,
        approved: Number(stats.approved_articles) || 0,
        rejected: Number(stats.rejected_articles) || 0,
      },
    };
  } catch (error) {
    return handleLoaderError(error, { fallbackMessage: "Couldn't load the articles list.", forbiddenRedirect: "/user/dashboard" });
  }
}
