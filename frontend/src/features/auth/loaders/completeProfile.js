import { redirect } from "react-router-dom";
import { authApi } from "../../api/authApi";

export default async function completeProfileLoader() {
  try {
    await authApi.oauthSession();
    return null;
  } catch {
    throw redirect("/login");
  }
}
