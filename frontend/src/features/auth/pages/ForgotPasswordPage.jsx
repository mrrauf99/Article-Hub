import { useState, useEffect } from "react";
import { Form, useActionData, useNavigation } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";

import AlertMessageBox from "../components/AlertMessageBox";
import InputField from "@/components/InputField";
import AuthLayout from "../components/AuthLayout";
import SwitchPage from "../components/SwitchPage";
import Button from "../components/Button";

import { useForgotPasswordForm } from "../hooks/useForgotPasswordForm";

export default function ForgotPassword() {
  const form = useForgotPasswordForm();
  const navigation = useNavigation();
  const actionData = useActionData();
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
      title="Forgot Password?"
      subtitle="Enter your email address and we'll send you a code to reset your password."
      subtitleStyle={{
        fontSize: "1rem",
        color: "#6b7280",
        lineHeight: "1.5",
      }}
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
          label="Email address"
          icon={Mail}
          type="email"
          name="email"
          value={form.values.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.email}
        />

        <Button disabled={isSubmitting} isLoading={isSubmitting}>
          {isSubmitting ? "Sending Code..." : "Send Code"}
        </Button>
      </Form>

      <SwitchPage icon={ArrowLeft} linkText="Back To Login" linkTo="/login" />
    </AuthLayout>
  );
}
