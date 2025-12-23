import {
  Form,
  useActionData,
  useFetcher,
  useNavigation,
  useSearchParams,
  useLoaderData,
} from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { useEffect, useState } from "react";
import { useOTPForm } from "../hooks/useOTPForm";
import OTPHeader from "../components/OTPHeader";
import OTPInputs from "../components/OTPInputs";
import OTPTimer from "../components/OTPTimer";
import Button from "../components/Button";
import SwitchPage from "../components/SwitchPage";

export default function OTPVerificationForm() {
  const otpForm = useOTPForm();
  const { reset } = otpForm;

  const { email } = useLoaderData();

  const resendFetcher = useFetcher();
  const actionData = useActionData();
  const navigation = useNavigation();

  // UI mode: controls which message + color is active
  const [mode, setMode] = useState("idle"); // idle | verify | resend

  const isVerifying = navigation.state === "submitting";
  const isResending = resendFetcher.state === "submitting";

  /* ---------------- STATUS (INPUT COLOR) ---------------- */

  const messageData =
    mode === "verify" && !isVerifying
      ? actionData
      : mode === "resend"
      ? resendFetcher.data
      : null;

  const status =
    messageData?.success === true
      ? "success"
      : messageData?.success === false
      ? "error"
      : "idle";

  // After resend success, ensure OTP is reset
  useEffect(() => {
    if (mode === "resend" && resendFetcher.data?.success) {
      reset();
    }
  }, [mode, resendFetcher.data?.success, reset]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-indigo-100 to-purple-50">
      <div className="bg-white w-full max-w-md rounded-2xl border shadow-xl p-8">
        <OTPHeader email={email} />

        <div className="flex flex-col gap-6 mt-4">
          <OTPInputs
            otp={otpForm.otp}
            inputRefs={otpForm.inputRefs}
            handleChange={otpForm.handleChange}
            handleKeyDown={otpForm.handleKeyDown}
            handlePaste={otpForm.handlePaste}
            isSubmitting={isVerifying}
            status={status}
            onUserInput={() => setMode("idle")}
          />

          {messageData?.message && status !== "idle" && (
            <div
              className={`text-center text-sm font-medium px-4 py-2 rounded-md ${
                status === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {messageData.message}
            </div>
          )}

          {/* RESEND OTP */}
          <resendFetcher.Form
            method="post"
            className="text-center"
            onSubmit={() => setMode("resend")}
          >
            <input type="hidden" name="intent" value="resend" />

            <OTPTimer
              timer={otpForm.timer}
              canResend={otpForm.canResend}
              isResending={isResending}
            />
          </resendFetcher.Form>

          {/* VERIFY OTP */}
          <Form method="post" onSubmit={() => setMode("verify")}>
            <input type="hidden" name="otp" value={otpForm.otp.join("")} />
            <input type="hidden" name="intent" value="verify" />

            <Button
              disabled={!otpForm.isOtpComplete || isVerifying || isResending}
              isLoading={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </Button>
          </Form>

          <SwitchPage
            icon={ArrowLeft}
            linkText="Back To Login"
            linkTo="/login"
          />
        </div>
      </div>
    </div>
  );
}
