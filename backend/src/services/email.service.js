import { mailTransporter } from "../config/mailer.config.js";

export async function sendEmailVerificationOtp(email, otp) {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Verify your email address",
    replyTo: "no-reply@articlehub.me", // disable replies
    headers: {
      "X-Auto-Response-Suppress": "All", // block auto replies
    },
    text: `Your Article Hub verification code is ${otp}. It expires in 5 minutes.`,
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

export async function sendContactEmail({ name, email, subject, message }) {
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: process.env.SMTP_USER,
    replyTo: email,
    subject: `[Contact Form] ${subject || "New Inquiry"}`,
    text: `
NEW CONTACT FORM SUBMISSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

From: ${name}
Email: ${email}
Subject: ${subject || "General Inquiry"}

MESSAGE:
${message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
This message was sent via Article Hub contact form.
Reply directly to this email to respond to ${name}.
    `,
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Contact Form Submission</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif">
  
  <table role="presentation" style="width:100%; max-width:100%; border-collapse:collapse; table-layout:fixed">
    <tr>
      <td align="center" style="padding:40px 20px">
        
        <!-- Main Container -->
        <table role="presentation" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.05); table-layout:fixed">
          
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding:32px 24px; border-radius:12px 12px 0 0">
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:600; letter-spacing:-0.5px">
                📬 New Contact Inquiry
              </h1>
              <p style="margin:8px 0 0; color:#dbeafe; font-size:13px">
                ${new Date().toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:24px">
              
              <!-- Contact Details -->
              <table role="presentation" style="width:100%; max-width:100%; border-collapse:collapse; margin-bottom:24px; table-layout:fixed">
                <tr>
                  <td style="padding:10px 12px; background:#f8fafc; border-left:3px solid #2563eb; border-radius:4px">
                    <p style="margin:0 0 4px; color:#64748b; font-size:11px; font-weight:600; text-transform:uppercase">
                      Name
                    </p>
                    <p style="margin:0; color:#0f172a; font-size:15px; font-weight:500; word-wrap:break-word; overflow-wrap:break-word">
                      ${name || "Not provided"}
                    </p>
                  </td>
                </tr>
                
                <tr><td style="height:8px"></td></tr>
                
                <tr>
                  <td style="padding:10px 12px; background:#f8fafc; border-left:3px solid #2563eb; border-radius:4px">
                    <p style="margin:0 0 4px; color:#64748b; font-size:11px; font-weight:600; text-transform:uppercase">
                      Email
                    </p>
                    <p style="margin:0; color:#0f172a; font-size:15px; font-weight:500; word-wrap:break-word; overflow-wrap:break-word">
                      <a href="mailto:${email}" style="color:#2563eb; text-decoration:none; word-wrap:break-word; overflow-wrap:break-word">
                        ${email || "Not provided"}
                      </a>
                    </p>
                  </td>
                </tr>
                
                <tr><td style="height:8px"></td></tr>
                
                <tr>
                  <td style="padding:10px 12px; background:#f8fafc; border-left:3px solid #2563eb; border-radius:4px">
                    <p style="margin:0 0 4px; color:#64748b; font-size:11px; font-weight:600; text-transform:uppercase">
                      Subject
                    </p>
                    <p style="margin:0; color:#0f172a; font-size:15px; font-weight:500; word-wrap:break-word; overflow-wrap:break-word">
                      ${subject || "General Inquiry"}
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Message Section -->
              <div style="border-top:1px solid #e2e8f0; padding-top:20px">
                <p style="margin:0 0 10px; color:#64748b; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:0.5px">
                  Message
                </p>
                <div style="background:#f8fafc; padding:16px; border-radius:6px; border:1px solid #e2e8f0">
                  <p style="margin:0; color:#1e293b; font-size:14px; line-height:1.6; white-space:pre-wrap; word-wrap:break-word; overflow-wrap:break-word; word-break:break-word">
${message || "No message provided"}
                  </p>
                </div>
              </div>

              <!-- Call to Action -->
              <div style="margin-top:24px; padding:16px; background:#eff6ff; border-radius:6px; text-align:center">
                <p style="margin:0 0 12px; color:#1e40af; font-size:13px">
                  💡 Reply to <strong>${name}</strong>
                </p>
                <a href="mailto:${email}?subject=Re: ${encodeURIComponent(
      subject || "Your inquiry"
    )}" 
                   style="display:inline-block; background:#2563eb; color:#ffffff; padding:10px 24px; border-radius:6px; text-decoration:none; font-weight:600; font-size:14px; word-wrap:break-word">
                  Reply to ${name}
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 24px; background:#f8fafc; border-radius:0 0 12px 12px; border-top:1px solid #e2e8f0">
              <p style="margin:0; color:#64748b; font-size:11px; text-align:center; line-height:1.5">
                This email was sent from your <strong>Article Hub</strong> contact form.<br>
                Use the button above to respond.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
    `,
  };

  return mailTransporter.sendMail(mailOptions);
}

export async function sendLoginNotificationEmail({
  to,
  name,
  ipAddress,
  userAgent,
  loggedInAt,
}) {
  const safeName = name || "there";
  const timestamp = loggedInAt || new Date();

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to,
    subject: "New login to your Article Hub account",
    replyTo: "no-reply@articlehub.me",
    headers: {
      "X-Auto-Response-Suppress": "All",
    },
    text: `
Hi ${safeName},

We noticed a new login to your Article Hub account.

Time: ${timestamp.toLocaleString("en-US")}
IP address: ${ipAddress || "Unknown"}
Device: ${userAgent || "Unknown"}

If this was you, no action is needed.
If you didn't log in, please reset your password immediately and review your account activity.

Thanks,
Article Hub Security
    `.trim(),
    html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Login Notification</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f4f6; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif">
  <table role="presentation" style="width:100%; max-width:100%; border-collapse:collapse; table-layout:fixed">
    <tr>
      <td align="center" style="padding:40px 20px">
        <table role="presentation" style="max-width:600px; width:100%; background:#ffffff; border-radius:12px; box-shadow:0 2px 8px rgba(0,0,0,0.05); table-layout:fixed">
          <tr>
            <td style="background:linear-gradient(135deg, #7c3aed 0%, #6366f1 100%); padding:32px 24px; border-radius:12px 12px 0 0">
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:600; letter-spacing:-0.5px">
                🔐 New account login
              </h1>
              <p style="margin:8px 0 0; color:#ede9fe; font-size:13px">
                ${timestamp.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:24px">
              <p style="margin:0 0 14px; color:#0f172a; font-size:15px">
                Hi ${safeName},
              </p>
              <p style="margin:0 0 20px; color:#475569; font-size:14px; line-height:1.6">
                We noticed a new login to your Article Hub account.
              </p>

              <table role="presentation" style="width:100%; max-width:100%; border-collapse:collapse; table-layout:fixed">
                <tr>
                  <td style="padding:12px; background:#f8fafc; border-radius:8px; border:1px solid #e2e8f0">
                    <p style="margin:0; color:#334155; font-size:13px">
                      <strong>Time:</strong> ${timestamp.toLocaleString(
                        "en-US"
                      )}
                    </p>
                    <p style="margin:6px 0 0; color:#334155; font-size:13px">
                      <strong>IP address:</strong> ${ipAddress || "Unknown"}
                    </p>
                    <p style="margin:6px 0 0; color:#334155; font-size:13px; word-wrap:break-word; overflow-wrap:break-word">
                      <strong>Device:</strong> ${userAgent || "Unknown"}
                    </p>
                  </td>
                </tr>
              </table>

              <div style="margin-top:20px; padding:16px; background:#fef2f2; border-radius:8px; border:1px solid #fecaca">
                <p style="margin:0; color:#991b1b; font-size:13px; line-height:1.6">
                  If this wasn’t you, reset your password immediately and review your account activity.
                </p>
              </div>
            </td>
          </tr>
          <tr>
            <td style="padding:18px 24px; background:#f8fafc; border-radius:0 0 12px 12px; border-top:1px solid #e2e8f0">
              <p style="margin:0; color:#64748b; font-size:11px; text-align:center; line-height:1.5">
                This is an automated security notification from Article Hub.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `,
  };

  return mailTransporter.sendMail(mailOptions);
}
