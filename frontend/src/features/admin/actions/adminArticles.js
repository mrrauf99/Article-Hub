import { adminApi } from "../../api/adminApi.js";
import {
  handleActionSuccess,
  handleActionError,
} from "../utils/actionHelpers.js";

export async function adminArticlesAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const articleId = formData.get("articleId");
  const reason = formData.get("reason");

  try {
    switch (intent) {
      case "approve":
        await adminApi.approveArticle(articleId);
        return handleActionSuccess("Article approved.");

      case "reject":
        await adminApi.rejectArticle(articleId, reason);
        return handleActionSuccess("Article rejected.");

      case "delete":
        await adminApi.deleteArticle(articleId, reason);
        return handleActionSuccess("Article deleted.");

      default:
        return { success: false, message: "Unknown action." };
    }
  } catch (error) {
    return handleActionError(error, intent || "operation");
  }
}
