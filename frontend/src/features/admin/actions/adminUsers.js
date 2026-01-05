import { adminApi } from "../../api/adminApi.js";
import {
  handleActionSuccess,
  handleActionError,
} from "../utils/actionHelpers.js";

export async function adminUsersAction({ request }) {
  const formData = await request.formData();
  const intent = formData.get("intent");
  const userId = formData.get("userId");

  try {
    switch (intent) {
      case "changeRole": {
        const newRole = formData.get("newRole");
        await adminApi.updateUserRole(userId, newRole);
        return handleActionSuccess("User role updated successfully");
      }

      case "delete":
        await adminApi.deleteUser(userId);
        return handleActionSuccess("User deleted successfully");

      default:
        return { success: false, message: "Unknown action" };
    }
  } catch (error) {
    return handleActionError(error, intent || "operation");
  }
}
