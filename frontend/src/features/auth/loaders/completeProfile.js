import { authApi } from "../../api/authApi";
import { handleLoaderError } from "@/utils/loaderError";

export default async function completeProfileLoader() {
  try {
    await authApi.oauthStatus();
    return null;
  } catch (error) {
    return handleLoaderError(error, { fallbackMessage: "We couldn't load your Google sign-in session. Please sign in again."});
  }
}
