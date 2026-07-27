import { sendContactEmail } from "../services/email.service.js";
import {
  validateEmail,
  validateLength,
  CONTACT_LIMITS,
} from "../utils/validation.utils.js";

export async function submitContact(req, res) {
  const { name, email, subject, message } = req.body;

  const errors = [
    validateLength(
      name,
      CONTACT_LIMITS.name.min,
      CONTACT_LIMITS.name.max,
      "Name",
    ),
    validateEmail(email),
    validateLength(
      subject,
      CONTACT_LIMITS.subject.min,
      CONTACT_LIMITS.subject.max,
      "Subject",
    ),
    validateLength(
      message,
      CONTACT_LIMITS.message.min,
      CONTACT_LIMITS.message.max,
      "Message",
    ),
  ].filter(Boolean);

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors,
    });
  }

  await sendContactEmail({
    name: name.trim(),
    email: email.trim(),
    subject: subject.trim(),
    message: message.trim(),
  });

  return res.status(200).json({
    success: true,
    message: "Message sent successfully.",
  });
}
