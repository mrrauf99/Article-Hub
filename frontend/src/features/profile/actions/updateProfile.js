import { apiClient } from "../../api/apiClient";

export default async function updateProfileAction({ request }) {
  const formData = await request.formData();

  // Check if there's an avatar file
  const avatarFile = formData.get("avatar");
  const hasAvatar = avatarFile && avatarFile.size > 0;

  // If we have an avatar, send as multipart/form-data
  if (hasAvatar) {
    const multipartData = new FormData();
    multipartData.append("avatar", avatarFile);
      multipartData.append("name", formData.get("name") || "");
      multipartData.append("expertise", formData.get("expertise") || "");
      multipartData.append("bio", formData.get("bio") || "");
      multipartData.append("gender", formData.get("gender") || "");
      multipartData.append("country", formData.get("country") || "");
      multipartData.append(
        "portfolio_url",
        formData.get("portfolio_url") || ""
      );
      multipartData.append("x_url", formData.get("x_url") || "");
      multipartData.append("linkedin_url", formData.get("linkedin_url") || "");
      multipartData.append("facebook_url", formData.get("facebook_url") || "");
      multipartData.append(
        "instagram_url",
        formData.get("instagram_url") || ""
      );

    try {
      const res = await apiClient.patch("user/profile", multipartData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        success: true,
        message: res.data.message,
      };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Failed to update profile",
      };
    }
  }

  // No avatar, send as JSON
  const payload = {
    name: formData.get("name"),
    expertise: formData.get("expertise"),
    bio: formData.get("bio"),
    gender: formData.get("gender") || null,
    country: formData.get("country") || null,
    portfolio_url: formData.get("portfolio_url"),
    x_url: formData.get("x_url"),
    linkedin_url: formData.get("linkedin_url"),
    facebook_url: formData.get("facebook_url"),
    instagram_url: formData.get("instagram_url"),
  };

  try {
    const res = await apiClient.patch("user/profile", payload);

    return {
      success: true,
      message: res.data.message,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Failed to update profile",
    };
  }
}
