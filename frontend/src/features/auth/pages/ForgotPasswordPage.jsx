import { useState, useEffect, useRef, startTransition } from "react";
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
  const lastActionDataRef = useRef(null);

  useEffect(() => {
    if (actionData?.message && actionData !== lastActionDataRef.current) {
      lastActionDataRef.current = actionData;
      startTransition(() => {
        setAlertMessage(actionData.message);
      });
    }
  }, [actionData]);

  function handleSubmit(e) {
    if (!form.validate()) {
      e.preventDefault();
    }
  }

  return (
    <AuthLayout
      title="Forgot password?"
      subtitle="Enter your email address and we'll send you a code to reset your password."
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
          label="Email address"
          icon={Mail}
          type="email"
          name="email"
          value={form.values.email}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.email}
          aria-required="true"
        />

        <Button disabled={isSubmitting} isLoading={isSubmitting}>
          {isSubmitting ? "Sending Code..." : "Send Code"}
        </Button>
      </Form>

      <SwitchPage icon={ArrowLeft} linkText="Back to login" linkTo="/login" />
    </AuthLayout>
  );
}
