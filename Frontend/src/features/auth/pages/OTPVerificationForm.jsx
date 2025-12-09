import {
  Form,
  useFetcher,
  useActionData,
  useNavigation,
  useSearchParams,
} from "react-router-dom";

import { useEffect } from "react";

import { useOTPForm } from "../hooks/useOTPForm";
import OTPTimer from "../components/OTPTimer";
import OTPHeader from "../components/OTPHeader";
import OTPInputs from "../components/OTPInputs";
import Button from "../components/Button";

export default function OTPVerificationForm() {
  const otpForm = useOTPForm();

  const resendFetcher = useFetcher();
  const navigation = useNavigation();
  const actionData = useActionData();
  const [params] = useSearchParams();

  const email = params.get("email");
  const isSubmitting = navigation.state === "submitting";
  const isResending = resendFetcher.state === "submitting";

  // Reset OTP UI strictly after backend confirms resend
  useEffect(() => {
    if (resendFetcher.data?.success) {
      otpForm.resetAfterResend();
    }
  }, [resendFetcher.data]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-indigo-100 to-purple-50">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
        <OTPHeader email={email} />

        <div method="post" className="flex flex-col gap-6 mt-4">
          <OTPInputs
            otp={otpForm.otp}
            inputRefs={otpForm.inputRefs}
            handleChange={otpForm.handleChange}
            handleKeyDown={otpForm.handleKeyDown}
            handlePaste={otpForm.handlePaste}
            isSubmitting={isSubmitting}
          />

          {/* /Verify message  */}
          {actionData?.message && (
            <div
              className={`text-center text-sm font-medium px-4 py-2 rounded-md transition-all ${
                actionData.success
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {actionData.message}
            </div>
          )}

          {/* Resend OTP */}
          <resendFetcher.Form method="post" className="text-center">
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="intent" value="resend" />

            <OTPTimer
              timer={otpForm.timer}
              canResend={otpForm.canResend}
              isResending={isResending}
            />
          </resendFetcher.Form>

          {/* Verify OTP*/}
          <Form method="post">
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="otp" value={otpForm.otp.join("")} />
            <input type="hidden" name="intent" value="verify" />

            <Button disabled={!otpForm.isOtpComplete || isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify OTP"}
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
