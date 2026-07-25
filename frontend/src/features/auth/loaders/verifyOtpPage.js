import { authApi } from "../../api/authApi";
import { redirect } from "react-router-dom";

export default async function verifyOtpPageLoader() {
  // Try signup flow first
  try {
    const res = await authApi.signupSession();
    if (res.data.success) {
      return { email: res.data.email, flow: "signup" };
    }
  } catch {
    // Not in signup flow — try password-reset flow
    try {
      const res = await authApi.passwordResetSession();
      if (res.data.success) {
        return { email: res.data.email, flow: "password-reset" };
      }
    } catch {
      // Neither cookie exists — kick back to login
      throw redirect("/login");
    }
  }
}

