import { useState, useRef, useEffect } from "react";

export function useOTPForm() {
  const OTP_LENGTH = 6;

  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const inputRefs = useRef([]);

  const isOtpComplete = otp.every(Boolean);

  // Timer logic
  useEffect(() => {
    if (timer <= 0) {
      setCanResend(true);
      return;
    }

    const id = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(id);
  }, [timer]);

  /* ---------- Handlers ---------- */
  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otp];
    next[index] = value;
    setOtp(next);

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").slice(0, OTP_LENGTH);

    if (!/^\d+$/.test(text)) return;

    const chars = text.split("");
    setOtp([...chars, ...Array(OTP_LENGTH - chars.length).fill("")]);
    inputRefs.current[Math.min(chars.length, OTP_LENGTH - 1)]?.focus();
  };

  const resetAfterResend = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimer(60);
    setCanResend(false);
    inputRefs.current[0]?.focus();
  };

  return {
    otp,
    timer,
    canResend,
    isOtpComplete,
    inputRefs,

    handleChange,
    handleKeyDown,
    handlePaste,
    resetAfterResend,
  };
}
