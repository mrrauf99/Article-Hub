import { authApi } from "../../api/authApi";
import { redirectToDashboard } from "@/utils/authUtils.js";

export default async function verifyTwoFactorLoginAction({ request }) {
  const formData = await request.formData();
  const code = formData.get("code");

  try {
    const { data } = await authApi.verifyTwoFactorLogin({ code });

    if (data.success && data.role) {
      return redirectToDashboard(data.role);
    }

    return {
      success: data.success,
      message: data.message,
    };
  } catch (err) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Unable to verify 2FA. Please try again.",
    };
  }
}
