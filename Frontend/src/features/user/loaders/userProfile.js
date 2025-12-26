import { redirect } from "react-router-dom";
import { apiClient } from "../../api/apiClient";

export default async function userProfileLoader() {
  try {
    const { data } = await apiClient.get("/api/auth/me");

    return {
      user: data.data,
    };
  } catch (err) {
    throw redirect("/login");
  }
}
