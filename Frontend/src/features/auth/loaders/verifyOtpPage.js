import { authApi } from "../../api/authApi";
import { data, redirect } from "react-router-dom";

export default async function verifyOtpPageLoader() {
  try {
    const res = await authApi.otpSession();
    if (res.data.success) {
      return res.data;
    }
  } catch {
    throw redirect("/register");
  }
}
