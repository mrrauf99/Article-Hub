import { Form } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import SignUpFields from "../components/SignUpFields";
import PasswordRequirements from "../components/PasswordRequirements";
import Divider from "../components/Divider";
import GoogleAuthButton from "../components/GoogleAuthButton";
import SwitchPage from "../components/SwitchPage";

import { useSignUpForm } from "../../hooks/auth/useSignUpForm";
import { useAvailability } from "../../hooks/auth/useAvailability";
import {
  validateUsername,
  validatePassword,
  isEmailValid,
} from "../../util/authValidation";

import eyeHidden from "../../assets/eye-hidden.png";
import eyeShow from "../../assets/eye-show.png";

export default function SignUp() {
  const form = useSignUpForm();

  const usernameCheck = useAvailability(
    form.username.enteredValue,
    form.username.didEdit,
    form.usernameError,
    "username"
  );

  const emailCheck = useAvailability(
    form.email.enteredValue,
    form.email.didEdit,
    form.emailError,
    "email"
  );

  function handleFormSubmit(e) {
    const isInvalidForm =
      form.name.hasError ||
      form.usernameError ||
      form.emailError ||
      form.password.hasError ||
      form.confirmPassword.hasError ||
      form.country.hasError ||
      form.passwordErrors.length > 0 ||
      usernameCheck.status === "taken" ||
      emailCheck.status === "taken";

    if (isInvalidForm) {
      e.preventDefault();
    }
  }

  return (
    <AuthLayout title="ArticleHub" subtitle="Create Account">
      <Form
        method="POST"
        className="flex flex-col gap-2"
        onSubmit={handleFormSubmit}
        noValidate
      >
        <SignUpFields
          form={form}
          usernameCheck={usernameCheck}
          emailCheck={emailCheck}
          eyeShow={eyeShow}
          eyeHidden={eyeHidden}
        />

        <PasswordRequirements
          errors={form.passwordErrors}
          visible={
            form.password.enteredValue.length > 0 ||
            form.confirmPassword.enteredValue.length > 0
          }
        />

        <button className="btn">Sign Up</button>
      </Form>

      <Divider />
      <GoogleAuthButton>Sign up with Google</GoogleAuthButton>

      <SwitchPage
        question="Already have an account?"
        linkText="Sign in"
        linkTo="/login"
      />
    </AuthLayout>
  );
}
