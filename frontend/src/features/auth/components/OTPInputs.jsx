import { memo, useCallback, useRef, useEffect } from "react";
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
    [isSubmitting, onUserInput, handlePaste]
  );

  // Container-level paste handler (works even when inputs aren't focused)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleContainerPaste = (e) => {
      if (isSubmitting) return;
      const text = e.clipboardData?.getData("text")?.trim();
      if (text && /^\d+$/.test(text)) {
        e.preventDefault();
        e.stopPropagation();
        onUserInput?.();
        handleOtpString?.(text);
      }
    };

    container.addEventListener("paste", handleContainerPaste);
    return () => container.removeEventListener("paste", handleContainerPaste);
  }, [isSubmitting, onUserInput, handleOtpString]);

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
          onPaste={handlePasteWrapper(index)}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
}

export default memo(OTPInputs);
