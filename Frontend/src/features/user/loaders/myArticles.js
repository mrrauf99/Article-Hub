import { apiClient } from "../../api/apiClient";
import { redirect } from "react-router-dom";

export default async function myArticlesLoader() {
  try {
    const { data } = await apiClient.get("/api/articles/me");

    return {
      success: data.success,
      articles: data.data,
    };
  } catch {
    throw redirect("/login");
  }
}
