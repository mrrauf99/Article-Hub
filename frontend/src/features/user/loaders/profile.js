import { apiClient } from "../../api/apiClient";
import { handleLoaderError } from "@/utils/loaderError";
import { redirectToDashboard } from "@/utils/authUtils";

export default async function profileLoader() {
  try {
    const { data } = await apiClient.get("user/summary");

    if (data.data.role === "admin") {
      return redirectToDashboard(data.data.role);
    }

    return {
      user: data.data,
    };
  } catch (error) {
    return handleLoaderError(error, { fallbackMessage: "Failed to load user profile." });
  }
}
