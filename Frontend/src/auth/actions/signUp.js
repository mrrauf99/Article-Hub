import { authApi } from "../../api/authApi";

export default async function signUpAction({ request }) {
  const data = await request.formData();
  const credentials = {
    name: data.get("name"),
    username: data.get("username"),
    email: data.get("email"),
    password: data.get("password"),
    confirmPassword: data.get("confirm-password"),
  };

  try {
    const res = await authApi.signup(credentials);
    return { success: true, message: res.data.message };
  } catch (err) {
    return { error: err.response?.data?.message || "SignUp failed" };
  }
}
