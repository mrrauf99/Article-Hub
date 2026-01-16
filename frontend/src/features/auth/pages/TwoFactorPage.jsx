import {
  Form,
  useActionData,
  useNavigation,
} from "react-router-dom";
import { ShieldCheck, CheckCircle } from "lucide-react";
import { useEffect, useRef, useState, startTransition } from "react";

import { useOTPForm } from "../hooks/useOTPForm";
import OTPInputs from "../components/OTPInputs";
import Button from "../components/Button";

export default function TwoFactorPage() {
  const otpForm = useOTPForm();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [message, setMessage] = useState(null);
  const lastActionRef = useRef(null);

  useEffect(() => {
    if (!actionData || actionData === lastActionRef.current) return;
    lastActionRef.current = actionData;
    startTransition(() => {
      setMessage({
        success: actionData.success,
        message: actionData.message,
      });
    });
  }, [actionData]);

  const status =
    message?.success === true
      ? "success"
      : message?.success === false
      ? "error"
      : "idle";

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-50 via-indigo-100 to-purple-50">
      <div className="bg-white w-full max-w-md rounded-2xl border shadow-xl p-8">
        <div className="text-center space-y-2">
          <div className="mx-auto h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Two-Factor Login</h1>
          <p className="text-sm text-slate-600">
            Enter the 6-digit code from Google Authenticator.
          </p>
        </div>

        <div className="mt-6 space-y-5">
          <OTPInputs
            otp={otpForm.otp}
            inputRefs={otpForm.inputRefs}
            handleChange={otpForm.handleChange}
            handleKeyDown={otpForm.handleKeyDown}
            handlePaste={otpForm.handlePaste}
            handleOtpString={otpForm.handleOtpString}
            isSubmitting={isSubmitting}
            status={status}
            onUserInput={() => setMessage(null)}
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

          <Form
            method="post"
            onSubmit={() => {
              setMessage(null);
            }}
          >
            <input type="hidden" name="token" value={otpForm.otp.join("")} />
            <Button disabled={!otpForm.isOtpComplete} isLoading={isSubmitting}>
              {isSubmitting ? (
                "Verifying..."
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 text-white" />
                  Verify & Continue
                </>
              )}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
}
