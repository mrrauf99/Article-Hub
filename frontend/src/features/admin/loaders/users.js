import { adminApi } from "../../api/adminApi.js";
import { getQueryParams } from "../utils/loaderHelpers.js";
import { handleLoaderError } from "@/utils/loaderError.js";

const PAGE_SIZE = 20;

export default async function usersLoader({ request }) {
  const params = getQueryParams(request, {
    search: "",
    page: "1",
  });

  try {
    const listResponse = await adminApi.getAllUsers({ ...params, limit: PAGE_SIZE });
    return {
      users: listResponse.data.data.users,
      pagination: listResponse.data.data.pagination,
      filters: { search: params.search },
    };
  } catch (error) {
    return handleLoaderError(error, { fallbackMessage: "Couldn't load the writers list." });
  }
}
