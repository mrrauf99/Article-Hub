import { Link, Form, useActionData, useNavigation } from "react-router-dom";
import { useEffect, useState } from "react";

import { User, Lock } from "lucide-react";
import AlertMessageBox from "../components/AlertMessageBox";
import InputField from "@/components/InputField";
import AuthLayout from "../components/AuthLayout";
import GoogleAuthButton from "../components/GoogleAuthButton";
import OrDivider from "../components/OrDivider";
import SwitchPage from "../components/SwitchPage";
import Button from "../components/Button";

import { useLoginForm } from "../hooks/useLoginForm";

export default function Login() {
  const form = useLoginForm();
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
        <InputField
          label="Username or email"
          icon={User}
          name="identifier"
          value={form.values.identifier}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.identifier}
        />

        <InputField
          label="Password"
          icon={Lock}
          type="password"
          name="password"
          value={form.values.password}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          error={form.errors.password}
        />

        <Button disabled={isSubmitting} isLoading={isSubmitting}>
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </Form>

      <div className="text-right mt-2">
        <Link
          to="/forgot-password"
          className="inline-block text-indigo-600 hover:underline px-1"
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
