import { authApi } from "../../api/authApi";
import { handleLoaderError } from "@/utils/loaderError";

export default async function passwordResetLoader() {
  try {
    await authApi.checkPasswordResetStatus();
    return null;
  } catch (error) {
    return handleLoaderError(error, {
      forbiddenRedirect: "/forgot-password",
      fallbackMessage: "Failed to load password reset session.",
    });
  }
}
