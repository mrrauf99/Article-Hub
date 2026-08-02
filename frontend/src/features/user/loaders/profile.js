import { apiClient } from "../../api/apiClient";
import { handleLoaderError } from "@/utils/loaderError";

export default async function profileLoader() {
  try {
    const { data } = await apiClient.get("user/profile");

    return {
      user: data.data,
    };
  } catch (error) {
    return handleLoaderError(error, { fallbackMessage: "Failed to load user profile." });
  }
}
