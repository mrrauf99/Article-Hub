import { redirect } from "react-router-dom";
import { authApi } from "../../api/authApi";

export default async function completeProfileAction({ request }) {
  const formData = await request.formData();
  const username = formData.get("username");

  try {
    const { data } = await authApi.oauthComplete({ username });
    if (data.success) {
      return redirect(data.redirectTo);
    }
    return redirect("/user/dashboard");
  } catch (err) {
    return {
      message: err.response?.data?.message || "Something went wrong",
    };
  }
}
