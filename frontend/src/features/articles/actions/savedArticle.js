import { data, redirect } from "react-router-dom";
import { savedArticlesApi } from "@/features/api/savedArticlesApi";

export default async function savedArticleAction({ params, request }) {
  if (!["POST", "DELETE"].includes(request.method)) {
    return data({ success: false, message: "Method not allowed." }, { status: 405 });
  }
  try {
    const response = request.method === "DELETE"
      ? await savedArticlesApi.unsave(params.articleId)
      : await savedArticlesApi.save(params.articleId);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) return redirect("/login");

    return data({
      success: false,
      message: error.response?.data?.message || "We couldn't update saved articles. Please try again.",
    }, { status: error.response?.status || 503 });
  }
}
