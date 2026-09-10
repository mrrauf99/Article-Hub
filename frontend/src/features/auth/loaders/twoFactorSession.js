import { authApi } from "../../api/authApi";
import { handleLoaderError } from "@/utils/loaderError";

export default async function twoFactorSessionLoader() {
  try {
    await authApi.checkTwoFactorStatus();
    return null;
  } catch (error) {
    return handleLoaderError(error, {
      fallbackMessage: "We couldn't load your two-factor login session. Please sign in again.",
    });
  }
}
