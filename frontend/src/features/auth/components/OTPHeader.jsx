import { MailCheck } from "lucide-react";
import styles from "../styles/OtpHeader.module.css";

export default function OTPHeader({ email }) {
  return (
    <div className={styles.header}>
      <div className={styles.icon}>
        <MailCheck strokeWidth={1.75} />
      </div>

      <h2 className={styles.title}>Verify your email</h2>
      <p className={styles.subtitle}>Enter the 6-digit code sent to</p>
      <p className={styles.email}>{email}</p>
    </div>
  );
}
