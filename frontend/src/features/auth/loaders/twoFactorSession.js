import { authApi } from "../../api/authApi";
import { handleLoaderError } from "@/utils/loaderError";

export default async function twoFactorSessionLoader() {
  try {
    await authApi.twoFactorSession();
    return null;
  } catch (error) {
    return handleLoaderError(error, {
      fallbackMessage: "Failed to load 2FA session.",
    });
  }
}
