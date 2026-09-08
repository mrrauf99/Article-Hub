import { adminApi } from "../../api/adminApi.js";
import { getQueryParams } from "../utils/loaderHelpers.js";
import { handleLoaderError } from "@/utils/loaderError.js";

const PAGE_SIZE = 20;

export default async function usersLoader({ request }) {
  const params = getQueryParams(request, {
    role: "all",
    search: "",
    page: "1",
  });

  try {
    const [listResponse, summaryResponse] = await Promise.all([
      adminApi.getAllUsers({ ...params, limit: PAGE_SIZE }),
      adminApi.getDashboardSummary(),
    ]);
    const { stats } = summaryResponse.data.data;
    const writers = Number(stats.total_users) || 0;
    const admins = Number(stats.total_admins) || 0;
    return {
      users: listResponse.data.data.users,
      pagination: listResponse.data.data.pagination,
      filters: { role: params.role, search: params.search },
      counts: { all: writers + admins, user: writers, admin: admins },
    };
  } catch (error) {
    return handleLoaderError(error, { fallbackMessage: "Failed to load members." });
  }
}
