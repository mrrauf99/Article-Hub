import { Form, useNavigation } from "react-router-dom";

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
  const isSubmitting = navigation.state === "submitting";

  function handleSubmit(e) {
    if (!form.validate()) {
      e.preventDefault();
    }
  }

  return (
    <AuthLayout title="Article Hub" subtitle="Create Account">
      <Form
        method="POST"
        className="flex flex-col gap-2"
        onSubmit={handleSubmit}
      >
        <SignUpFields form={form} />

        <PasswordRequirements
          errors={form.passwordErrors}
          passwordEntered={form.values.password.length > 0}
          confirmEntered={form.values.confirmPassword.length > 0}
        />

        <Button disabled={isSubmitting} isLoading={isSubmitting}>
          {isSubmitting ? "Signing Up..." : "Sign Up"}
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
