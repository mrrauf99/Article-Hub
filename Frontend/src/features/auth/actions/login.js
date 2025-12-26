import { authApi } from "../../api/authApi";
import { redirect } from "react-router-dom";

export default async function loginAction({ request }) {
  const data = await request.formData();
  const payload = {
    identifier: data.get("identifier"),
    password: data.get("password"),
  };

  try {
    const { data } = await authApi.login(payload);
    if (data.success) {
      if (data.role === "user") return redirect("/user/dashboard");

      if (data.role === "admin") return redirect("/admin/dashboard");
    }

    return {
      success: data.success,
      message: data.message,
    };
  } catch (err) {
    // RATE LIMIT ERROR
    if (err.response?.status === 429) {
      const { message, retryAfterSeconds } = err.response.data;

      return {
        success: false,
        retryAfterSeconds,
      };
    }

    // AUTH ERROR
    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Something went wrong. Please try again.",
    };
  }
}
