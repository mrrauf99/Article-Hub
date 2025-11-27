import { authApi } from "../../api/authApi";

export default async function loginAction({ request }) {
  const data = await request.formData();
  const credentials = {
    identifier: data.get("identifier"),
    password: data.get("password"),
  };

  try {
    const res = await authApi.login(credentials);
    return { success: true, message: res.data.message };
  } catch (err) {
    return { error: err.response?.data?.message || "Login failed" };
  }
}
