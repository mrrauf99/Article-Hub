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
      message: "Your message is on its way.",
    };
  } catch (err) {
    const data = err.response?.data;
    const message = Array.isArray(data?.errors)
      ? data.errors.join(" ")
      : data?.message || "We couldn't send that. Try again in a moment.";

    return {
      success: false,
      message,
    };
  }
}
