import { sendContactEmail } from "../services/email.service.js";
import { validateRequired, validateEmail, validateLength } from "../utils/validation.utils.js";

export async function submitContact(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    const errors = [];

    try {
      validateRequired(name, "Name");
      validateLength(name, 2, 100, "Name");
    } catch (err) {
      errors.push(err.message);
    }

    try {
      validateEmail(email);
    } catch (err) {
      errors.push(err.message);
    }

    try {
      validateRequired(subject, "Subject");
      validateLength(subject, 5, 200, "Subject");
    } catch (err) {
      errors.push(err.message);
    }

    try {
      validateRequired(message, "Message");
      validateLength(message, 10, 2000, "Message");
    } catch (err) {
      errors.push(err.message);
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: errors.join(", "),
      });
    }

    await sendContactEmail({ name, email, subject, message });

    return res.status(201).json({
      success: true,
      message: "Message sent successfully.",
    });
  } catch (err) {
    console.error("Contact error:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to send message. Please try again later.",
    });
  }
}
