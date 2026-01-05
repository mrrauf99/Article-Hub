import {
  Form,
  useActionData,
  useFetcher,
  useNavigation,
  useNavigate,
  useLoaderData,
} from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { useEffect, useState, useRef, startTransition } from "react";

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
  const navigate = useNavigate();

  const [mode, setMode] = useState("idle"); // idle | verify | resend
  const [message, setMessage] = useState(null); // { success, message }

  // Track the last actionData to detect new responses
  const lastActionDataRef = useRef(null);

  const isVerifying = navigation.state === "submitting";
  const isResending = resendFetcher.state === "submitting";

  /* ---------- Update message when new response arrives ---------- */
  // Handle verify action response
  useEffect(() => {
    if (
      mode === "verify" &&
      actionData &&
      actionData !== lastActionDataRef.current
    ) {
      lastActionDataRef.current = actionData;
      startTransition(() => {
        setMessage({ success: actionData.success, message: actionData.message });
      });
    }
  }, [actionData, mode]);

  const lastResendDataRef = useRef(null);
  // Handle resend fetcher response
  useEffect(() => {
    if (mode === "resend" && resendFetcher.data && resendFetcher.data !== lastResendDataRef.current) {
      lastResendDataRef.current = resendFetcher.data;
      startTransition(() => {
        setMessage({
          success: resendFetcher.data.success,
          message: resendFetcher.data.message,
        });
      });
    }
  }, [resendFetcher.data, mode]);

  // Clear message when user starts typing (mode becomes idle)
  useEffect(() => {
    if (mode === "idle") {
      startTransition(() => {
        setMessage(null);
      });
    }
  }, [mode]);

  // Clear message when submitting
  useEffect(() => {
    if (isVerifying || isResending) {
      startTransition(() => {
        setMessage(null);
      });
    }
  }, [isVerifying, isResending]);

  const status =
    message?.success === true
      ? "success"
      : message?.success === false
      ? "error"
      : "idle";

  const isVerifySuccess = mode === "verify" && actionData?.success === true;

  /* ---------- effects ---------- */

  // reset OTP after resend success
  useEffect(() => {
    if (mode === "resend" && resendFetcher.data?.success) {
      reset();
    }
  }, [mode, resendFetcher.data?.success, reset]);

  // redirect after verify success
  useEffect(() => {
    if (mode === "verify" && actionData?.success && actionData?.next) {
      const t = setTimeout(() => {
        navigate(actionData.next, { replace: true });
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [mode, actionData, navigate]);

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
            isSubmitting={isVerifying || isVerifySuccess}
            status={status}
            onUserInput={() => setMode("idle")}
          />

          {message?.message && status !== "idle" && (
            <div
              className={`text-center text-sm font-medium px-4 py-2 rounded-md ${
                status === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message.message}
            </div>
          )}

          {/* ----- RESEND OTP (hidden after success) ----- */}
          {!isVerifySuccess && (
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
          )}

          {/* ----- VERIFY OTP ----- */}
          <Form
            method="post"
            onSubmit={() => {
              setMode("verify");
            }}
          >
            <input type="hidden" name="otp" value={otpForm.otp.join("")} />
            <input type="hidden" name="intent" value="verify" />

            <Button
              disabled={
                !otpForm.isOtpComplete || isResending || isVerifySuccess
              }
              isLoading={isVerifying}
            >
              {isVerifySuccess ? (
                <>
                  <CheckCircle className="w-5 h-5 text-white" />
                  Verified
                </>
              ) : (
                "Verify OTP"
              )}
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
