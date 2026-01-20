import { memo, useCallback, useRef } from "react";
import styles from "../styles/OtpInputs.module.css";

function OTPInputs({
  otp,
  inputRefs,
  handleChange,
  handleKeyDown,
  handlePaste,
  handleOtpString,
  isSubmitting,
  status = "idle",
  onUserInput,
}) {
  const statusClass = status !== "idle" ? styles[status] : "";
  const containerRef = useRef(null);

  const handlePasteWrapper = useCallback(
    (index) => (e) => {
      if (isSubmitting) return;
      onUserInput?.();
      handlePaste(e, index);
    },
    [isSubmitting, onUserInput, handlePaste],
  );

  return (
    <div ref={containerRef} className={`${styles.inputs} ${statusClass}`}>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          data-1p-ignore="true"
          data-lpignore="true"
          data-form-type="other"
          maxLength="6"
          value={digit}
          disabled={isSubmitting}
          className={`${styles.input} ${isSubmitting ? styles.disabled : ""}`}
          onChange={(e) => {
            if (isSubmitting) return;
            onUserInput?.();
            const value = e.target.value;

            // Handle multi-digit input (paste/autofill): distribute across all fields
            if (value.length > 1 && /^\d+$/.test(value)) {
              e.target.value = "";
              handleOtpString?.(value);
              return;
            }

            // Single digit: update this field and move to next
            handleChange(index, value);
          }}
          onKeyDown={(e) => {
            if (isSubmitting) return;
            handleKeyDown(index, e);
          }}
          onPaste={handlePasteWrapper(index)}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}

export default memo(OTPInputs);
