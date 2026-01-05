import styles from "../styles/OtpHeader.module.css";

export default function OTPHeader({ email }) {
  return (
    <div className={styles.header}>
      <div className={styles.icon}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>

      <h2 className={styles.title}>Verify Your Email</h2>
      <p className={styles.subtitle}>Enter the 6-digit code sent to</p>
      <p className={styles.email}>{email}</p>
    </div>
  );
}
