import { authApi } from "../../api/authApi";
import { handleLoaderError } from "@/utils/loaderError";

export default async function verifyOtpPageLoader() {
  // Try signup flow first
  try {
    const res = await authApi.checkSignupStatus();
    if (res.data.success) {
      return { email: res.data.email, flow: "signup" };
    }
  } catch (err) {
    // Only swallow 401 (cookie absent/expired) — re-throw anything else
    if (err.response?.status !== 401) {
      return handleLoaderError(err, { fallbackMessage: "Failed to verify signup session." });
    }

    // Not in signup flow — try password-reset flow
    try {
      const res = await authApi.checkPasswordResetStatus();
      if (res.data.success) {
        return { email: res.data.email, flow: "password-reset" };
      }
    } catch (err2) {
      // handleLoaderError will automatically redirect 401 to /login
      return handleLoaderError(err2, { fallbackMessage: "Failed to verify password reset session." });
    }
  }
}
