import {
  useEffect,
  useState,
  useRef,
  startTransition,
  useCallback,
  useMemo,
} from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";

import { Lock, ArrowLeft } from "lucide-react";
import AlertMessageBox from "../components/AlertMessageBox";
import InputField from "@/components/InputField";
import AuthLayout from "../components/AuthLayout";
import PasswordRequirements from "../components/PasswordRequirements";
import SwitchPage from "../components/SwitchPage";
import Button from "../components/Button";

import { usePasswordResetForm } from "../hooks/usePasswordResetForm";

export default function PasswordReset() {
  const form = usePasswordResetForm();
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
      title="Reset password"
      subtitle="Create a new secure password for your account."
    >
      {alertMessage && (
        <AlertMessageBox
          message={alertMessage}
          setAlertMessage={setAlertMessage}
        />
      )}

      <Form
        method="POST"
        className="flex flex-col gap-4"
        onSubmit={handleSubmit}
      >
        <InputField
          label="New password"
          icon={Lock}
          type="password"
          name="password"
          value={form.values.password}
          onChange={form.handleChange}
          onFocus={form.handleFocus}
          onBlur={form.handleBlur}
          error={form.errors.password}
          disabled={isSubmitting}
          aria-required="true"
        />

        <InputField
          label="Confirm password"
          icon={Lock}
          type="password"
          name="confirmPassword"
          value={form.values.confirmPassword}
          onChange={form.handleChange}
          onFocus={form.handleFocus}
          onBlur={form.handleBlur}
          error={form.errors.confirmPassword}
          disabled={isSubmitting}
          aria-required="true"
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

      <SwitchPage icon={ArrowLeft} linkText="Back to login" linkTo="/login" />
    </AuthLayout>
  );
}
