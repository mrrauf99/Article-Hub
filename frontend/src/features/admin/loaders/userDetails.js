import { adminApi } from "../../api/adminApi.js";
import { handleLoaderError } from "@/utils/loaderError.js";

export default async function userDetailsLoader({ params }) {
  try {
    const response = await adminApi.getUserDetails(params.userId);
    return response.data.data;
  } catch (error) {
    return handleLoaderError(error, { fallbackMessage: "Couldn't load this member's profile." });
  }
}
