import { redirect } from "react-router-dom";
import { apiClient } from "../../api/apiClient.js";

export default async function createArticleAction({ request, params }) {
  try {
    const formData = await request.formData();
    const isEditing = !!params?.id;

    if (isEditing) {
      // Update existing article
      await apiClient.patch(`/api/articles/${params.id}`, formData);
    } else {
      // Create new article
      await apiClient.post("/api/articles", formData);
    }

    return redirect("/dashboard/articles");
  } catch (err) {
    console.error("createArticleAction error:", err);

    return {
      success: false,
      message: err.response?.data?.message || "Failed to save article",
    };
  }
}
