import { apiClient } from "../../api/apiClient";

export default async function submitContactAction({ request }) {
  try {
    const formData = await request.formData();

    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    await apiClient.post("contact", payload);

    return {
      success: true,
      message: "Message sent successfully",
    };
  } catch (err) {
    return {
      success: false,
      message: err.response?.data?.message || "Something went wrong",
    };
  }
}
