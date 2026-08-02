import { redirect } from "react-router-dom";
import { apiClient } from "../../api/apiClient";
import { handleLoaderError } from "@/utils/loaderError";

export default async function editArticleLoader({ params }) {
  const { id } = params;

  if (!id) {
    return redirect("/user/dashboard");
  }

  try {
    const { data } = await apiClient.get(`articles/me/${id}`);

    return {
      article: data.data,
    };
  } catch (error) {
    return handleLoaderError(error, {
      forbiddenRedirect: "/user/dashboard",
      fallbackMessage: "Failed to load article.",
    });
  }
}
