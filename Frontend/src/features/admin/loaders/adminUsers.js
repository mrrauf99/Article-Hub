import { adminApi } from "../../api/adminApi.js";
import {
  handleLoaderError,
  getQueryParams,
} from "../utils/loaderHelpers.js";

export default async function adminUsersLoader({ request }) {
  const params = getQueryParams(request, {
    role: "all",
    search: "",
    page: "1",
  });

  try {
    const response = await adminApi.getAllUsers({
      ...params,
      limit: 10,
    });
    return {
      users: response.data.data.users,
      pagination: response.data.data.pagination,
      filters: { role: params.role, search: params.search },
    };
  } catch (error) {
    return handleLoaderError(error, "Failed to load users");
  }
}
