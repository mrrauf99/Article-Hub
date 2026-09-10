import { Form, useActionData, useNavigation } from "react-router-dom";
import { useEffect, useRef, useState, startTransition } from "react";

import AlertMessageBox from "../components/AlertMessageBox";
import AuthLayout from "../components/AuthLayout";
import SignUpFields from "../components/SignUpFields";
import PasswordRequirements from "../components/PasswordRequirements";
import OrDivider from "../components/OrDivider";
import GoogleAuthButton from "../components/GoogleAuthButton";
import SwitchPage from "../components/SwitchPage";
import Button from "../components/Button";

import { useSignUpForm } from "../hooks/useSignUpForm";

export default function SignUp() {
  const form = useSignUpForm();
  const navigation = useNavigation();
  const actionData = useActionData();
  const isSubmitting = navigation.state === "submitting";

  const [alertMessage, setAlertMessage] = useState("");
  const lastActionDataRef = useRef(null);

  useEffect(() => {
    if (
      actionData?.success === false &&
      actionData !== lastActionDataRef.current
    ) {
      lastActionDataRef.current = actionData;
      const msg = Array.isArray(actionData.message)
        ? actionData.message.join(" ")
        : actionData.message ||
          "We couldn't create your account. Please try again.";

      startTransition(() => {
        setAlertMessage(msg);
      });
    }
  }, [actionData]);

  function handleSubmit(e) {
    if (!form.validate()) {
      e.preventDefault();
    }
  }

  return (
    <AuthLayout title="Create your account" subtitle="Join a space built for focused reading and writing.">
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
        <SignUpFields form={form} isDisabled={isSubmitting} />

        <PasswordRequirements
          errors={form.passwordErrors}
          passwordEntered={form.values.password.length > 0}
          confirmEntered={form.values.confirmPassword.length > 0}
        />

        <Button disabled={isSubmitting} isLoading={isSubmitting}>
          {isSubmitting ? "Signing up…" : "Sign up"}
        </Button>
      </Form>

      <OrDivider />
      <GoogleAuthButton>Sign up with Google</GoogleAuthButton>

      <SwitchPage
        question="Already have an account?"
        linkText="Sign in"
        linkTo="/login"
      />
    </AuthLayout>
  );
}
