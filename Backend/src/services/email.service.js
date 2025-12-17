import { mailTransporter } from "../config/mailer.config.js";

export async function sendEmailVerificationOtp(email, otp) {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Verify your email address",
    html: `
      <div style="font-family: Arial; line-height: 1.6">
        <h2>Email Verification</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 3px">${otp}</h1>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
  };

  await mailTransporter.sendMail(mailOptions);
}
