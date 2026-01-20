import {
  useEffect,
  useState,
  useRef,
  startTransition,
  useCallback,
  useMemo,
} from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";

import { Lock } from "lucide-react";
import AlertMessageBox from "../components/AlertMessageBox";
import InputField from "@/components/InputField";
import AuthLayout from "../components/AuthLayout";
import PasswordRequirements from "../components/PasswordRequirements";
import SwitchPage from "../components/SwitchPage";
import Button from "../components/Button";

import { useResetPasswordForm } from "../hooks/useResetPasswordForm";

const SUBTITLE_STYLE = {
  fontSize: "1rem",
  color: "#6b7280",
  lineHeight: "1.5",
};

export default function ResetPassword() {
  const form = useResetPasswordForm();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = useMemo(
    () => navigation.state === "submitting",
    [navigation.state],
  );

  const [alertMessage, setAlertMessage] = useState("");
  const lastActionDataRef = useRef(null);

  useEffect(() => {
    if (
      actionData?.success === false &&
      actionData !== lastActionDataRef.current
    ) {
      lastActionDataRef.current = actionData;
      startTransition(() => {
        setAlertMessage(actionData.message);
      });
    }
  }, [actionData]);

  const handleSubmit = useCallback(
    (e) => {
      if (!form.validate()) {
        e.preventDefault();
      }
    },
    [form],
  );

  const passwordEntered = useMemo(
    () => form.values.password.length > 0,
    [form.values.password],
  );

  const confirmEntered = useMemo(
    () => form.values.confirmPassword.length > 0,
    [form.values.confirmPassword],
  );

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new secure password for your account."
      subtitleStyle={SUBTITLE_STYLE}
    >
      {alertMessage && (
        <AlertMessageBox
          message={alertMessage}
          setAlertMessage={setAlertMessage}
        />
      )}

      <Form
        method="POST"
        className="flex flex-col gap-2"
        onSubmit={handleSubmit}
      >
        <InputField
          label="New Password"
          icon={Lock}
          type="password"
          name="password"
          value={form.values.password}
          onChange={form.handleChange}
          onFocus={form.handleFocus}
          onBlur={form.handleBlur}
          error={form.errors.password}
          disabled={isSubmitting}
        />

        <InputField
          label="Confirm Password"
          icon={Lock}
          type="password"
          name="confirmPassword"
          value={form.values.confirmPassword}
          onChange={form.handleChange}
          onFocus={form.handleFocus}
          onBlur={form.handleBlur}
          error={form.errors.confirmPassword}
          disabled={isSubmitting}
        />

        <PasswordRequirements
          errors={form.passwordErrors}
          passwordEntered={passwordEntered}
          confirmEntered={confirmEntered}
        />

        <Button disabled={isSubmitting} isLoading={isSubmitting}>
          {isSubmitting ? "Resetting Password..." : "Reset Password"}
        </Button>
      </Form>

      <SwitchPage linkText="← Back To Login" linkTo="/login" />
    </AuthLayout>
  );
}
