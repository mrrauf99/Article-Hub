import { redirect } from "react-router-dom";
import { authApi } from "../../api/authApi";

export default async function resetPasswordLoader() {
  try {
    await authApi.passwordResetSession();
    return null;
  } catch {
    throw redirect("/forgot-password");
  }
}

