import { adminApi } from "../../api/adminApi.js";
import {
  handleActionError,
  handleActionSuccess,
} from "../utils/actionHelpers.js";

export async function adminUsersAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const userId = formData.get("userId");

  try {
    switch (intent) {
      case "delete":
        await adminApi.deleteUser(userId);
        return handleActionSuccess("Member deleted.");

      default:
        return { success: false, message: "Unknown action." };
    }
  } catch (error) {
    return handleActionError(error, intent || "operation");
  }
}
