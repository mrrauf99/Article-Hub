import { useState, useRef, useEffect, useCallback } from "react";

const OTP_LENGTH = 6;
const INITIAL_TIMER = 60;

const emptyOtp = () => Array(OTP_LENGTH).fill("");

export function useOTPForm() {
  const [otp, setOtp] = useState(emptyOtp);
  const [timer, setTimer] = useState(INITIAL_TIMER);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);
  const isOtpComplete = otp.every(Boolean);

  /* ---------------- Timer ---------------- */

  useEffect(() => {
    if (canResend) return;

    const id = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [canResend]);

  /* ---------------- Handlers ---------------- */

  const handleChange = useCallback((index, value) => {
    if (!/^\d?$/.test(value)) return;

    setOtp((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }, []);

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp],
  );

  const handlePaste = useCallback((e, startIndex = 0) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(text)) return;

    const chars = text.split("");
    setOtp((prev) => {
      const next = [...prev];
      const endIndex = Math.min(startIndex + chars.length, OTP_LENGTH);
      for (let i = startIndex; i < endIndex; i++) {
        next[i] = chars[i - startIndex];
      }
      return next;
    });

    const focusIndex = Math.min(startIndex + chars.length, OTP_LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
  }, []);

  // Handle OTP string (for clipboard paste)
  const handleOtpString = useCallback((otpString) => {
    const text = otpString.replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text || !/^\d+$/.test(text)) return;

    const chars = text.split("");
    const newOtp = emptyOtp();

    for (let i = 0; i < Math.min(chars.length, OTP_LENGTH); i++) {
      newOtp[i] = chars[i];
    }

    setOtp(newOtp);

    // Focus the next empty field or last field if all filled
    const focusIndex = Math.min(chars.length, OTP_LENGTH - 1);
    setTimeout(() => {
      inputRefs.current[focusIndex]?.focus();
    }, 0);
  }, []);

  const reset = useCallback(() => {
    setOtp(emptyOtp());
    setTimer(INITIAL_TIMER);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  }, []);

  return {
    otp,
    timer,
    canResend,
    isOtpComplete,
    inputRefs,
    handleChange,
    handleKeyDown,
    handlePaste,
    handleOtpString,
    reset,
  };
}
