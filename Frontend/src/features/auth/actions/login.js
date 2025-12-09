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
      return redirect("/dashboard");
    }
    return { ...data };
  } catch (err) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Something went wrong. Please try again.",
    };
  }
}
