import { redirect } from "react-router-dom";
import { authApi } from "../../api/authApi";

export default async function twoFactorSessionLoader() {
  try {
    await authApi.twoFactorSession();
    return null;
  } catch {
    return redirect("/login");
  }
}
