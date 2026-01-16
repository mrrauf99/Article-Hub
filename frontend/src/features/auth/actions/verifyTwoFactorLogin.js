import { authApi } from "../../api/authApi";
import { redirectToDashboard } from "@/utils/authUtils.js";

export default async function verifyTwoFactorLoginAction({ request }) {
  const formData = await request.formData();
  const token = formData.get("token");

  try {
    const { data } = await authApi.verifyTwoFactorLogin({ token });

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
