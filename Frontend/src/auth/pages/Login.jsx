import { Link, Form } from "react-router-dom";
import { useState } from "react";

import eyeHidden from "../../assets/eye-hidden.png";
import eyeShow from "../../assets/eye-show.png";

import Input from "../components/Input";
import AuthLayout from "../components/AuthLayout";
import GoogleAuthButton from "../components/GoogleAuthButton";
import Divider from "../components/Divider";
import SwitchPage from "../components/SwitchPage";

import { useInput } from "../../hooks/auth/useInput";
import { isEmpty } from "../../util/authValidation";

import "../../styles/auth/auth-layout.css";
import "../../styles/auth/form.css";
import "../../styles/auth/alert-box.css";

export default function Login() {
  const [showAlert, setShowAlert] = useState(false);

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

  return (
    <AuthLayout title="ArticleHub" subtitle="Welcome Back">
      {showAlert && (
        <div className="alert">
          <span className="alert-text">Incorrect username or password.</span>
          <button className="alert-close" onClick={() => setShowAlert(false)}>
            &times;
          </button>
        </div>
      )}

      <Form method="POST" className="flex flex-col gap-2">
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
        <button className="btn">Sign In</button>
      </Form>

      <Link
        to="/forgot-password"
        className="block text-right mt-2 text-indigo-600 hover:underline"
      >
        Forgot password?
      </Link>

      <Divider />
      <GoogleAuthButton>Sign in with Google</GoogleAuthButton>
      <SwitchPage
        question="Don't have an account?"
        linkText="Sign up"
        linkTo="/signup"
      />
    </AuthLayout>
  );
}
