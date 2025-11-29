import Input from "../components/Input";
import CountryDropdown from "../components/CountryDropdown";

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
        name="name"
        {...form.name}
        error={form.name.hasError && "Please fill out this field."}
      />

      <Input
        type="text"
        label="Username"
        id="username"
        name="username"
        {...form.username}
        error={
          form.usernameError ||
          (usernameCheck.status === "taken" && usernameCheck.message)
        }
        isLoading={usernameCheck.status === "checking"}
      />

      <Input
        label="Email"
        id="email"
        name="email"
        type="email"
        {...form.email}
        error={
          form.emailError ||
          (emailCheck.status === "taken" && emailCheck.message)
        }
        isLoading={emailCheck.status === "checking"}
      />

      <Input
        label="Password"
        id="password"
        name="password"
        type="password"
        {...form.password}
        eyeShow={eyeShow}
        eyeHidden={eyeHidden}
        error={form.password.hasError && "Please fill out this field."}
      />

      <Input
        label="Confirm Password"
        id="confirm-password"
        name="confirmPassword"
        type="password"
        {...form.confirmPassword}
        eyeShow={eyeShow}
        eyeHidden={eyeHidden}
        error={form.confirmPassword.hasError && "Please fill out this field."}
      />

      <CountryDropdown
        value={form.country.enteredValue}
        hasError={form.country.hasError}
        onChange={form.country.handleChange}
        onBlur={form.country.handleBlur}
      />

      {/* Hidden input to send country data with form */}
      <input type="hidden" name="country" value={form.country.enteredValue} />
    </>
  );
}
