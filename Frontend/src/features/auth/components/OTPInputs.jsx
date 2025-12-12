import styles from "../styles/OtpInputs.module.css";

export default function OTPInputs({
  otp,
  inputRefs,
  handleChange,
  handleKeyDown,
  handlePaste,
  isSubmitting,
}) {
  return (
    <div className={styles.inputs}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength={1}
          value={digit}
          disabled={isSubmitting}
          inputMode="numeric"
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={index === 0 ? handlePaste : null}
          className={styles.input}
        />
      ))}
    </div>
  );
}
