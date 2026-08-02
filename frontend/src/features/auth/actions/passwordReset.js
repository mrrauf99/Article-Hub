import { authApi } from "../../api/authApi";
import { redirect } from "react-router-dom";

export default async function passwordResetAction({ request }) {
  const formData = await request.formData();

  const password = formData.get("password");

  try {
    const { data } = await authApi.passwordReset({ password });
    if (data.success) {
      return redirect("/login");
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
        "Unable to reset password. Please try again.",
    };
  }
}
