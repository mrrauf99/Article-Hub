import { adminApi } from "../../api/adminApi.js";
import { handleActionSuccess, handleActionError } from "../utils/actionHelpers.js";

export async function adminArticlesAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const articleId = formData.get("articleId");

  try {
    switch (intent) {
      case "approve":
        await adminApi.approveArticle(articleId);
        return handleActionSuccess("Article approved successfully");

      case "reject":
        await adminApi.rejectArticle(articleId);
        return handleActionSuccess("Article rejected successfully");

      case "delete":
        await adminApi.deleteArticle(articleId);
        return handleActionSuccess("Article deleted successfully");

      default:
        return { success: false, message: "Unknown action" };
    }
  } catch (error) {
    return handleActionError(error, intent || "operation");
  }
}
