import { authApi } from "../../api/authApi";
import { redirect } from "react-router-dom";

export default async function signUpAction({ request }) {
  const formData = await request.formData();

  const payload = {
    name: formData.get("name"),
    username: formData.get("username"),
    email: formData.get("email"),
    password: formData.get("password"),
    country: formData.get("country"),
  };

  try {
    const { data } = await authApi.signup(payload);

    if (data.success) {
      return redirect("/verify-otp");
    }

    return {
      success: false,
      message: data.message,
    };
  } catch (err) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Something went wrong. Please try again.",
    };
  }
}
