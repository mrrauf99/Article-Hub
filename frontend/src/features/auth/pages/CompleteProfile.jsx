import { Form, useNavigation } from "react-router-dom";
import { User } from "lucide-react";

import InputField from "@/components/InputField";
import AuthLayout from "../components/AuthLayout";
import Button from "../components/Button";

import { useUsernameForm } from "../hooks/useUsernameForm";

export default function CompleteProfile() {
  const form = useUsernameForm();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === "submitting";

  function handleSubmit(e) {
    if (!form.validate()) {
      e.preventDefault();
    }
  }

  return (
    <AuthLayout
      title="Choose a username"
      subtitle="This will be your public identity on Article Hub."
      subtitleStyle={{
        fontSize: "1rem",
        color: "#6b7280",
        lineHeight: "1.5",
      }}
    >
      <Form
        method="POST"
        className="flex flex-col gap-2"
        onSubmit={handleSubmit}
      >
        <InputField
          label="Username"
          icon={User}
          name="username"
          value={form.values.username}
          onChange={form.handleChange}
          onBlur={form.handleBlur}
          loading={form.usernameCheck.status === "checking"}
          error={
            form.errors.username ||
            (form.usernameCheck.status === "unavailable" &&
              form.usernameCheck.message) ||
            (form.usernameCheck.status === "error" &&
              form.usernameCheck.message)
          }
          success={form.usernameCheck.status === "available"}
        />

        <Button disabled={isSubmitting} isLoading={isSubmitting}>
          {isSubmitting ? "Creating account..." : "Continue"}
        </Button>
      </Form>
    </AuthLayout>
  );
}
