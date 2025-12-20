import { useState, useEffect } from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";

import AlertMessageBox from "../components/AlertMessageBox";
import Input from "../components/Input";
import AuthLayout from "../components/AuthLayout";
import SwitchPage from "../components/SwitchPage";
import Button from "../components/Button";

import { useInput } from "../hooks/useInput";
import { isEmpty, isEmailValid } from "../util/authValidation";

export default function ForgotPassword() {
  const [alertMessage, setAlertMessage] = useState("");
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.message) {
      setAlertMessage(actionData.message);
    }
  }, [actionData]);

  const email = useInput("", (v) => !isEmpty(v) && isEmailValid(v));

  const errorMsg =
    email.hasError &&
    (!email.value
      ? "Please fill out this field."
      : "Please enter a valid email address.");

  function handleSubmit(e) {
    if (errorMsg) {
      e.preventDefault();
    }
  }

  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter your email address and we'll send you a code to reset your password."
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
          label="Email address"
          id="email"
          name="email"
          {...email}
          error={errorMsg}
        />

        <Button disabled={isSubmitting} isLoading={isSubmitting}>
          {isSubmitting ? "Sending Code..." : "Send Code"}
        </Button>
      </Form>

      <SwitchPage linkText="← Back to Sign In" linkTo="/login" />
    </AuthLayout>
  );
}
