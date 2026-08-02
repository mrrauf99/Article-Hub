import { redirect } from "react-router-dom";
import { authApi } from "../../api/authApi";
import { handleLoaderError } from "@/utils/loaderError";

export default async function createArticleLoader() {
  try {
    const { data } = await authApi.session();

    // Redirect admins - they cannot create articles
    if (data.role === "admin") {
      return redirect("/admin/dashboard");
    }

    return null;
  } catch (error) {
    return handleLoaderError(error, { fallbackMessage: "Authentication required." });
  }
}
