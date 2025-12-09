import { authApi } from "../../api/authApi";
import { redirect } from "react-router-dom";

export default async function verifyOtpAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");

  //  RESEND OTP

  if (intent === "resend") {
    const email = formData.get("email");

    try {
      const { data } = await authApi.resendOTP({ email });

      return {
        success: data.success,
        message: data.message,
      };
    } catch (err) {
      return {
        success: false,
        message:
          err.response?.data?.message ||
          "Failed to resend code. Please try again.",
      };
    }
  }

  //  VERIFY OTP
  else if (intent === "verify") {
    const payload = {
      email: formData.get("email"),
      otp: formData.get("otp"),
    };

    try {
      const { data } = await authApi.verifyOTP(payload);

      if (data.success) {
        return redirect("/dashboard");
      }

      return {
        success: false,
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

  // FALLBACK
  return {
    success: false,
    message: "Invalid request.",
  };
}
