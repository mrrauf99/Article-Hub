import { useState, useEffect } from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";

import AlertMessageBox from "../components/AlertMessageBox";
import Input from "../components/Input";
import AuthLayout from "../components/AuthLayout";
import PasswordRequirements from "../components/PasswordRequirements";
import SwitchPage from "../components/SwitchPage";
import Button from "../components/Button";

import eyeHidden from "../assets/eye-hidden.png";
import eyeShow from "../assets/eye-show.png";

import { useInput } from "../hooks/useInput";
import { isEmpty, validatePassword } from "../util/authValidation";

export default function ResetPassword() {
  const [alertMessage, setAlertMessage] = useState("");
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.message) {
      setAlertMessage(actionData.message);
    }
  }, [actionData]);

  const newPassword = useInput("", (v) => !isEmpty(v));
  const confirmPassword = useInput("", (v) => !isEmpty(v));
  const passwordErrors = validatePassword(
    newPassword.enteredValue,
    confirmPassword.enteredValue
  );

  function handleSubmit(e) {
    const isInvalidForm =
      Object.values(passwordErrors).some((v) => v === false) ||
      newPassword.hasError ||
      confirmPassword.hasError;

    if (isInvalidForm) {
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
        <Input
          label="New Password"
          id="new-password"
          name="new-password"
          type="password"
          handleChange={newPassword.handleChange}
          handleBlur={newPassword.handleBlur}
          error={newPassword.hasError && "Please fill out this field."}
          eyeShow={eyeShow}
          eyeHidden={eyeHidden}
        />
        <Input
          label="Confirm Password"
          id="confirm-password"
          name="confirm-password"
          type="password"
          handleChange={confirmPassword.handleChange}
          handleBlur={confirmPassword.handleBlur}
          error={confirmPassword.hasError && "Please fill out this field."}
          eyeShow={eyeShow}
          eyeHidden={eyeHidden}
        />

        <PasswordRequirements
          errors={passwordErrors}
          passwordEntered={newPassword.enteredValue.length > 0}
          confirmEntered={confirmPassword.enteredValue.length > 0}
        />

        <Button disabled={isSubmitting} isLoading={isSubmitting}>
          {isSubmitting ? "Resetting Password..." : "Reset Password"}
        </Button>
      </Form>

      <SwitchPage linkText="← Back to Sign In" linkTo="/login" />
    </AuthLayout>
  );
}
