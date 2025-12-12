import { Link, Form } from "react-router-dom";
import { useState, useEffect } from "react";
import { useActionData, useNavigation } from "react-router-dom";

import eyeHidden from "../assets/eye-hidden.png";
import eyeShow from "../assets/eye-show.png";

import AlertMessageBox from "../components/AlertMessageBox";
import Input from "../components/Input";
import AuthLayout from "../components/AuthLayout";
import GoogleAuthButton from "../components/GoogleAuthButton";
import OrDivider from "../components/OrDivider";
import SwitchPage from "../components/SwitchPage";
import Button from "../components/Button";

import { useInput } from "../hooks/useInput";
import { isEmpty } from "../util/authValidation";

export default function Login() {
  const [alertMessage, setAlertMessage] = useState("");
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  useEffect(() => {
    if (actionData?.message) {
      setAlertMessage(actionData.message);
    }
  }, [actionData]);

  const {
    enteredValue: identifier,
    handleChange: handleIdentifierChange,
    handleBlur: handleIdentifierBlur,
    hasError: identifierError,
  } = useInput("", (v) => !isEmpty(v));

  const {
    enteredValue: password,
    handleChange: handlePasswordChange,
    handleBlur: handlePasswordBlur,
    hasError: passwordError,
    didEdit: passwordDidEdit,
  } = useInput("", (v) => !isEmpty(v));

  const passwordErrorMsg =
    (passwordError && "Please fill out this field.") ||
    (passwordDidEdit &&
      password.length < 8 &&
      "Password must be at least 8 characters.") ||
    (passwordDidEdit &&
      password.length > 64 &&
      "Password must be less than 64 characters.");

  function handleSubmit(e) {
    const isInvalidForm = !identifier || !password || passwordErrorMsg;

    if (isInvalidForm) {
      e.preventDefault();
    }
  }

  return (
    <AuthLayout title="Article Hub" subtitle="Welcome Back">
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
          label="Username or email"
          id="identifier"
          type="text"
          name="identifier"
          handleChange={handleIdentifierChange}
          handleBlur={handleIdentifierBlur}
          enteredValue={identifier}
          error={identifierError && "Please fill out this field."}
        />
        <Input
          label="Password"
          id="password"
          type="password"
          name="password"
          enteredValue={password}
          handleChange={handlePasswordChange}
          handleBlur={handlePasswordBlur}
          error={passwordErrorMsg}
          eyeShow={eyeShow}
          eyeHidden={eyeHidden}
        />

        <Button disabled={isSubmitting} isLoading={isSubmitting}>
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </Form>

      <div className="text-right mt-2">
        <Link
          to="/forgot-password"
          className="inline-block text-indigo-600 hover:underline focus:outline-none px-1"
        >
          Forgot password?
        </Link>
      </div>

      <OrDivider />
      <GoogleAuthButton>Sign in with Google</GoogleAuthButton>

      <SwitchPage
        question="Don't have an account?"
        linkText="Sign up"
        linkTo="/register"
      />
    </AuthLayout>
  );
}
