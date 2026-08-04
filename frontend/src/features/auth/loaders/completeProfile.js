import { authApi } from "../../api/authApi";
import { handleLoaderError } from "@/utils/loaderError";

export default async function completeProfileLoader() {
  try {
    await authApi.oauthStatus();
    return null;
  } catch (error) {
    return handleLoaderError(error, { fallbackMessage: "Failed to load OAuth session." });
  }
}
