import { Form, useNavigation } from "react-router-dom";

import AuthLayout from "../components/AuthLayout";
import SignUpFields from "../components/SignUpFields";
import PasswordRequirements from "../components/PasswordRequirements";
import OrDivider from "../components/OrDivider";
import GoogleAuthButton from "../components/GoogleAuthButton";
import SwitchPage from "../components/SwitchPage";
import Button from "../components/Button";

import { useSignUpForm } from "../hooks/useSignUpForm";

import eyeHidden from "../assets/eye-hidden.png";
import eyeShow from "../assets/eye-show.png";

export default function SignUp() {
  const form = useSignUpForm();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  function handleFormSubmit(e) {
    if (form.isInvalidForm) {
      e.preventDefault();
    }
  }

  return (
    <AuthLayout title="Article Hub" subtitle="Create Account">
      <Form
        method="POST"
        className="flex flex-col gap-2"
        onSubmit={handleFormSubmit}
      >
        <SignUpFields
          form={form}
          usernameCheck={form.usernameCheck}
          emailCheck={form.emailCheck}
          eyeShow={eyeShow}
          eyeHidden={eyeHidden}
        />

        <PasswordRequirements
          errors={form.passwordErrors}
          passwordEntered={form.password.enteredValue.length > 0}
          confirmEntered={form.confirmPassword.enteredValue.length > 0}
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
