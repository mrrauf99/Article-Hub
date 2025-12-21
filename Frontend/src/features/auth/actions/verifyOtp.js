import { authApi } from "../../api/authApi";
import { redirect } from "react-router-dom";

export default async function verifyOtpAction({ request }) {
  const formData = await request.formData();
  const url = new URL(request.url);
  const flow = url.searchParams.get("flow");
  const email = url.searchParams.get("email");

  const otp = formData.get("otp");
  const intent = formData.get("intent");

  //  RESEND OTP
  if (intent === "resend") {
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
  if (intent === "verify") {
    const payload = {
      email,
      otp,
      flow,
    };

    try {
      const { data } = await authApi.verifyOTP(payload);

      if (!data.success) {
        return {
          success: false,
          message: data.message,
        };
      }

      if (flow === "reset-password")
        return redirect(`/reset-password?email=${encodeURIComponent(email)}`);

      if (flow === "signup") return redirect("/dashboard");
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
