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
    multipartData.append(
      "portfolio_link",
      formData.get("portfolio_link") || ""
    );
    multipartData.append("x_link", formData.get("x_link") || "");
    multipartData.append("linkedin_link", formData.get("linkedin_link") || "");
    multipartData.append("facebook_link", formData.get("facebook_link") || "");
    multipartData.append(
      "instagram_link",
      formData.get("instagram_link") || ""
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
    portfolio_link: formData.get("portfolio_link"),
    x_link: formData.get("x_link"),
    linkedin_link: formData.get("linkedin_link"),
    facebook_link: formData.get("facebook_link"),
    instagram_link: formData.get("instagram_link"),
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
