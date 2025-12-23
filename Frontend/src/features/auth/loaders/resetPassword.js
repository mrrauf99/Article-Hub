import { redirect } from "react-router-dom";
import { authApi } from "../../api/authApi";

export default async function resetPasswordLoader() {
  try {
    await authApi.otpSession();

    return null;
  } catch {
    throw redirect("/forgot-password");
  }
}
