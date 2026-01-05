import { redirect } from "react-router-dom";
import { apiClient } from "../../api/apiClient";

export default async function userProfileLoader() {
  try {
    const { data } = await apiClient.get("/api/user/profile");

    return {
      user: data.data,
    };
  } catch {
    throw redirect("/login");
  }
}
