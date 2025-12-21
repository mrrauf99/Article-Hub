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
    [otp]
  );

  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").slice(0, OTP_LENGTH);
    if (!/^\d+$/.test(text)) return;

    const chars = text.split("");
    setOtp([...chars, ...Array(OTP_LENGTH - chars.length).fill("")]);

    inputRefs.current[Math.min(chars.length, OTP_LENGTH - 1)]?.focus();
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
    reset,
  };
}
