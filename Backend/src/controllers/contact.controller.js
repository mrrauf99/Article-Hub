import { sendContactEmail } from "../services/email.service.js";

export async function submitContact(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    await sendContactEmail({ name, email, subject, message });

    return res.status(201).json({
      message: "Message received successfully",
    });
  } catch (err) {
    console.error("Contact error:", err);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
}
