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
      // Container handler with capture phase handles multi-digit pastes
      // This only handles single character pastes as fallback
      e.stopPropagation();
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
        e.stopImmediatePropagation();
        onUserInput?.();
        handleOtpString?.(text);
      }
    };

    // Use capture phase to handle paste before individual inputs
    container.addEventListener("paste", handleContainerPaste, true);
    return () => container.removeEventListener("paste", handleContainerPaste, true);
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
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
          data-1p-ignore="true"
          data-lpignore="true"
          data-form-type="other"
          maxLength={1}
          value={digit}
          disabled={isSubmitting}
          className={`${styles.input} ${isSubmitting ? styles.disabled : ""}`}
          onChange={(e) => {
            if (isSubmitting) return;
            onUserInput?.();
            const value = e.target.value;
            // Handle autofill: if multiple digits are entered at once, treat as full OTP
            if (value.length > 1 && /^\d+$/.test(value)) {
              // Clear the input value since it contains multiple digits
              e.target.value = "";
              // Process the full OTP string
              handleOtpString?.(value);
              return;
            }
            handleChange(index, value);
          }}
          onInput={(e) => {
            if (isSubmitting) return;
            const value = e.target.value;
            // Handle autofill suggestions that fill multiple digits (onInput fires before onChange)
            if (value.length > 1 && /^\d+$/.test(value)) {
              // Clear the input value
              e.target.value = "";
              e.stopPropagation();
              onUserInput?.();
              handleOtpString?.(value);
            }
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
