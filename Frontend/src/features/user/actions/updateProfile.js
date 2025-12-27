import { redirect } from "react-router-dom";
import { apiClient } from "../../api/apiClient";

export default async function updateProfileAction({ request }) {
  const formData = await request.formData();

  const payload = {
    name: formData.get("name"),
    expertise: formData.get("expertise"),
    bio: formData.get("bio"),
    portfolio_link: formData.get("portfolio_link"),
    x_link: formData.get("x_link"),
    linkedin_url: formData.get("linkedin_url"),
    facebook_url: formData.get("facebook_url"),
    instagram_url: formData.get("instagram_url"),
  };

  try {
    const res = await apiClient.patch("/api/user/profile", payload);

    return {
      success: true,
      message: res.data.message,
    };
  } catch (err) {
    return {
      success: false,
      message: err.response.data.message,
    };
  }
}
