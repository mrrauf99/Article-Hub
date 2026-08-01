import { adminApi } from "../../api/adminApi.js";
import { handleLoaderError, getQueryParams } from "../utils/loaderHelpers.js";

const DEFAULT_LIMIT = 9;

export default async function usersLoader({ request }) {
  const params = getQueryParams(request, {
    role: "all",
    search: "",
    page: "1",
  });

  try {
    const response = await adminApi.getAllUsers({
      ...params,
      limit: DEFAULT_LIMIT,
    });
    return {
      users: response.data.data.users,
      pagination: response.data.data.pagination,
      filters: { role: params.role, search: params.search },
    };
  } catch (error) {
    console.error("Admin users loader error:", error);
    return handleLoaderError(error, "Failed to load users");
  }
}
