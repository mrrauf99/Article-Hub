import { Link, Form } from "react-router-dom";
import { useState, useEffect } from "react";
import { useActionData, useNavigation } from "react-router-dom";

import eyeHidden from "../assets/eye-hidden.png";
import eyeShow from "../assets/eye-show.png";

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
  } = useInput("", (v) => !isEmpty(v));

  function handleSubmit(e) {
    const isInvalidForm = !identifier || !password;

    if (isInvalidForm) {
      e.preventDefault();
    }
  }

  return (
    <AuthLayout title="Article Hub" subtitle="Welcome Back">
      {alertMessage && (
        <div
          className="flex items-center justify-between  bg-red-100 text-red-700 
        border border-red-300 p-3 rounded-md text-sm mb-2 animate-fadeIn"
        >
          <span>{alertMessage}</span>
          <button
            onClick={() => setAlertMessage("")}
            className="text-red-700 hover:text-red-900 text-xl leading-none"
          >
            &times;
          </button>
        </div>
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
          error={passwordError && "Please fill out this field."}
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
          className="inline-block text-indigo-600 hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 rounded px-1"
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
