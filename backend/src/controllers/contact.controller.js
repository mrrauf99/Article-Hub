import { sendContactEmail } from "../services/email.service.js";

export async function submitContact(req, res) {
  const { name, email, subject, message } = req.body;

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
