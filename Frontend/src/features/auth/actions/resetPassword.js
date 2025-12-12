import { authApi } from "../../api/authApi";
import { redirect } from "react-router-dom";

export default async function resetPasswordAction({ request }) {
  const formData = await request.formData();
  const url = new URL(request.url);
  const email = url.searchParams.get("email");

  const password = formData.get("new-password");

  try {
    const payload = { email, password };

    const { data } = await authApi.resetPassword(payload);
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
