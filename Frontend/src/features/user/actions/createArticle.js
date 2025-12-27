import { redirect } from "react-router-dom";
import { apiClient } from "../../api/apiClient.js";

export default async function createArticleAction({ request }) {
  try {
    const formData = await request.formData();

    const title = formData.get("title");
    const category = formData.get("category");
    const introduction = formData.get("introduction");
    const content = formData.get("content");
    const summary = formData.get("summary");
    const imageFile = formData.get("image");

    let imageUrl = null;

    /* ---------------- UPLOAD IMAGE ---------------- */
    if (imageFile && imageFile.size > 0) {
      const imgData = new FormData();
      imgData.append("image", imageFile);

      const uploadRes = await apiClient.post(
        "/api/articles/upload/image",
        imgData
      );

      imageUrl = uploadRes.data.imageUrl;
    }

    console.log("Image URL:", imageUrl);

    /* ---------------- CREATE ARTICLE ---------------- */
    await apiClient.post("/api/articles", {
      title,
      category,
      introduction,
      content,
      summary,
      imageUrl,
    });

    return redirect("/dashboard/articles");
  } catch (err) {
    console.error("createArticleAction error:", err);

    return {
      success: false,
      message: err.response.data.message,
    };
  }
}
