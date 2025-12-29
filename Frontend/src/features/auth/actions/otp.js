import { authApi } from "../../api/authApi";

export default async function otpAction({ request }) {
  const formData = await request.formData();

  const otp = formData.get("otp");
  const intent = formData.get("intent");

  /* ---------------- RESEND OTP ---------------- */
  if (intent === "resend") {
    try {
      const { data } = await authApi.resendOTP();

      return {
        success: true,
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

  /* ---------------- VERIFY OTP ---------------- */
  if (intent === "verify") {
    try {
      const { data } = await authApi.verifyOTP({ otp });

      if (!data.success) {
        return {
          success: false,
          message: data.message,
        };
      }

      return {
        success: true,
        message: "OTP verified successfully.",
        next: data.next,
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

  /* ---------------- FALLBACK ---------------- */
  return {
    success: false,
    message: "Invalid request.",
  };
}
