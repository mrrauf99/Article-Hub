import { authApi } from "../../api/authApi";

export default async function completeProfileAction({ request }) {
  const formData = await request.formData();
  const username = formData.get("username");

  try {
    await authApi.oauthComplete({ username });
  } catch (err) {
    return {
      message: err.response?.data?.message || "Something went wrong",
    };
  }
}
