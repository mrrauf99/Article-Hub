import { useEffect, useState } from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";

import { Lock } from "lucide-react";
import AlertMessageBox from "../components/AlertMessageBox";
import InputField from "@/components/InputField";
import AuthLayout from "../components/AuthLayout";
import PasswordRequirements from "../components/PasswordRequirements";
import SwitchPage from "../components/SwitchPage";
import Button from "../components/Button";

import { useResetPasswordForm } from "../hooks/useResetPasswordForm";

export default function ResetPassword() {
  const form = useResetPasswordForm();
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (actionData?.message) {
      setAlertMessage(actionData.message);
    }
  }, [actionData]);

  function handleSubmit(e) {
    if (!form.validate()) {
      e.preventDefault();
    }
  }

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a new secure password for your account."
      subtitleStyle={{ fontSize: "1rem", color: "#6b7280", lineHeight: "1.5" }}
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
          onBlur={form.handleBlur}
          error={form.errors.password}
        />

        <InputField
          label="Confirm Password"
          icon={Lock}
          type="password"
          name="confirmPassword"
          value={form.values.confirmPassword}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.confirmPassword}
        />

        <PasswordRequirements
          errors={form.passwordErrors}
          passwordEntered={form.values.password.length > 0}
          confirmEntered={form.values.confirmPassword.length > 0}
        />

        <Button disabled={isSubmitting} isLoading={isSubmitting}>
          {isSubmitting ? "Resetting Password..." : "Reset Password"}
        </Button>
      </Form>

      <SwitchPage linkText="← Back to Sign In" linkTo="/login" />
    </AuthLayout>
  );
}
