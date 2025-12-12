import { authApi } from "../../api/authApi";
import { redirect } from "react-router-dom";

export default async function forgotPasswordAction({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");

  try {
    const { data } = await authApi.forgotPassword({ email });
    if (data.success) {
      return redirect(
        `/verify-otp?email=${encodeURIComponent(email)}&flow=reset_password`
      );
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
        "Something went wrong. Please try again.",
    };
  }
}
