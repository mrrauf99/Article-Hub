import { authApi } from "../../api/authApi";
import { redirect } from "react-router-dom";
import { redirectToDashboard } from "@/utils/authUtils.js";

export default async function loginAction({ request }) {
  const data = await request.formData();
  const payload = {
    identifier: data.get("identifier"),
    password: data.get("password"),
  };

  try {
    const { data } = await authApi.login(payload);
    if (data.success && data.twoFactorRequired) {
      return redirect("/two-factor");
    }

    if (data.success && data.role) {
      return redirectToDashboard(data.role);
    }

    return {
      success: data.success,
      message: data.message,
    };
  } catch (err) {
    if (err.response?.status === 429) {
      return {
        success: false,
        retryAfterSeconds: err.response.data.retryAfterSeconds,
      };
    }

    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Something went wrong. Please try again.",
    };
  }
}
