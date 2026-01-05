import { redirect } from "react-router-dom";
import { apiClient } from "../../api/apiClient";

export default async function editArticleLoader({ params }) {
  const { id } = params;

  if (!id) {
    throw redirect("/user/dashboard");
  }

  try {
    const { data } = await apiClient.get(`/api/articles/${id}`);

    return {
      article: data.data,
    };
  } catch {
    // Article not found OR not owned by user
    throw redirect("/user/dashboard");
  }
}
