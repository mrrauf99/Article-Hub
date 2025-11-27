import { Form, Link } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import SignUpFields from "../components/SignUpFields";
import PasswordRequirements from "../components/PasswordRequirements";
import Divider from "../components/Divider";
import GoogleAuthButton from "../components/GoogleAuthButton";

import { useSignUpForm } from "../../hooks/auth/useSignUpForm";
import { useAvailability } from "../../hooks/auth/useAvailability";

import eyeHidden from "../../assets/eye-hidden.png";
import eyeShow from "../../assets/eye-show.png";

export default function SignUp() {
  const form = useSignUpForm();

  const usernameCheck = useAvailability(
    form.username.enteredValue,
    form.username.didEdit,
    form.username.hasError,
    "username"
  );

  const emailCheck = useAvailability(
    form.email.enteredValue,
    form.email.didEdit,
    form.email.hasError,
    "email"
  );

  return (
    <AuthLayout title="ArticleHub" subtitle="Create Account">
      <Form method="POST" className="flex flex-col gap-2">
        <SignUpFields
          form={form}
          usernameCheck={usernameCheck}
          emailCheck={emailCheck}
          eyeShow={eyeShow}
          eyeHidden={eyeHidden}
        />

        <button className="btn">Sign Up</button>
      </Form>

      <PasswordRequirements
        errors={form.passwordErrors}
        visible={
          form.password.enteredValue.length > 0 ||
          form.confirmPassword.enteredValue.length > 0
        }
      />

      <Divider />
      <GoogleAuthButton>Sign up with Google</GoogleAuthButton>

      <p className="switch-page">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </AuthLayout>
  );
}
