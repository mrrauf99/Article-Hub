import Input from "../components/Input";

export default function SignUpFields({
  form,
  usernameCheck,
  emailCheck,
  eyeShow,
  eyeHidden,
}) {
  return (
    <>
      <Input
        type="text"
        label="Name"
        id="name"
        {...form.name}
        error={form.name.hasError && "Please fill out this field."}
      />

      <Input
        type="text"
        label="Username"
        id="username"
        {...form.username}
        error={
          form.usernameError ||
          (usernameCheck.status === "taken" && usernameCheck.message)
        }
      />

      <Input
        label="Email"
        id="email"
        type="email"
        {...form.email}
        error={
          form.emailError ||
          (emailCheck.status === "taken" && emailCheck.message)
        }
        isLoading={usernameCheck.status === "checking"}
      />

      <Input
        label="Password"
        id="password"
        type="password"
        {...form.password}
        eyeShow={eyeShow}
        eyeHidden={eyeHidden}
        error={form.password.hasError && "Please fill out this field."}
        isLoading={emailCheck.status === "checking"}
      />

      <Input
        label="Confirm Password"
        id="confirm-password"
        type="password"
        {...form.confirmPassword}
        eyeShow={eyeShow}
        eyeHidden={eyeHidden}
        error={form.confirmPassword.hasError && "Please fill out this field."}
      />
    </>
  );
}
