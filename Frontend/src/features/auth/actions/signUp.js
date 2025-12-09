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
    const response = await authApi.signup(payload);

    if (response.data.success) {
      return redirect(`/verify-otp?email=${encodeURIComponent(payload.email)}`);
    }
  } catch (err) {
    return {
      success: false,
      message:
        err.response?.data?.message ||
        "Something went wrong. Please try again.",
    };
  }
}
