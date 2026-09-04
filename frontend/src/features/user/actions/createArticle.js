import { redirect } from "react-router-dom";
import { apiClient } from "../../api/apiClient.js";

export default async function createArticleAction({ request, params }) {
  try {
    const formData = await request.formData();
    const isEditing = !!params?.id;

    if (isEditing) {
      await apiClient.patch(`articles/${params.id}`, formData);
    } else {
      await apiClient.post("articles", formData);
    }

    return redirect(`/user/dashboard?submitted=${isEditing ? "updated" : "new"}`);
  } catch (err) {
    console.error("createArticleAction error:", err);

    return {
      success: false,
      message: err.response?.data?.message || "Failed to save article.",
      errors: err.response?.data?.errors || [],
    };
  }
}
