import styles from "../styles/OtpInputs.module.css";

export default function OTPInputs({
  otp,
  inputRefs,
  handleChange,
  handleKeyDown,
  handlePaste,
  isSubmitting,
  status = "idle",
  onUserInput,
}) {
  return (
    <div className={`${styles.inputs} ${styles[status] || ""}`}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          disabled={isSubmitting}
          className={`${styles.input} ${isSubmitting ? styles.disabled : ""}`}
          onChange={(e) => {
            if (isSubmitting) return;
            onUserInput?.();
            handleChange(index, e.target.value);
          }}
          onKeyDown={(e) => {
            if (isSubmitting) return;
            handleKeyDown(index, e);
          }}
          onPaste={
            index === 0
              ? (e) => {
                  if (isSubmitting) return;
                  onUserInput?.();
                  handlePaste(e);
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
