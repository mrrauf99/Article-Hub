import { Form, useActionData, useNavigation } from "react-router-dom";
import { ShieldCheck, CheckCircle } from "lucide-react";
import { useEffect, useRef, useState, startTransition } from "react";

import { useOTPForm } from "../hooks/useOTPForm";
import AuthLayout from "../components/AuthLayout";
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
    <AuthLayout>
      <div className="text-center mb-8">
        <div className="mx-auto mb-4 flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full bg-ink">
          <ShieldCheck className="h-6 w-6 text-paper" strokeWidth={1.75} />
        </div>
        <h1 className="font-editorial text-3xl text-ink mb-2">
          Two-factor login
        </h1>
        <p className="text-[0.9375rem] text-ink-muted">
          Enter the 6-digit code from your authenticator app.
        </p>
      </div>

      <div className="space-y-6">
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
            className={`text-center text-sm font-medium px-4 py-2 rounded-lg font-ui ${
              status === "success"
                ? "bg-moss-50 text-moss-700"
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
          <input type="hidden" name="code" value={otpForm.otp.join("")} />
          <Button disabled={!otpForm.isOtpComplete} isLoading={isSubmitting}>
            {isSubmitting ? (
              "Verifying..."
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Verify & continue
              </>
            )}
          </Button>
        </Form>
      </div>
    </AuthLayout>
  );
}
