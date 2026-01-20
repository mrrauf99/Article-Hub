import { adminApi } from "../../api/adminApi.js";
import { handleLoaderError } from "../utils/loaderHelpers.js";

export default async function adminUserDetailsLoader({ params }) {
  try {
    const response = await adminApi.getUserDetails(params.userId);
    return response.data.data;
  } catch (error) {
    return handleLoaderError(error, "Failed to load user profile");
  }
}
