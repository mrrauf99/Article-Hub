import InputField from "@/components/InputField";
import CountryDropdown from "./CountryDropdown";
import { UserCircle, User, Mail, Lock } from "lucide-react";

export default function SignUpFields({ form }) {
  return (
    <>
      {/* Name */}
      <InputField
        label="Name"
        icon={UserCircle}
        name="name"
        value={form.values.name}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.errors.name}
      />

      {/* Username */}
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
          (form.usernameCheck.status === "error" && form.usernameCheck.message)
        }
        success={form.usernameCheck.status === "available"}
      />

      {/* Email */}
      <InputField
        label="Email"
        icon={Mail}
        type="email"
        name="email"
        placeholder="abc@example.com"
        value={form.values.email}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        loading={form.emailCheck.status === "checking"}
        error={
          form.errors.email ||
          (form.emailCheck.status === "unavailable" &&
            form.emailCheck.message) ||
          (form.emailCheck.status === "error" && form.emailCheck.message)
        }
        success={form.emailCheck.status === "available"}
      />

      {/* Country */}
      <CountryDropdown
        name="country"
        value={form.values.country}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        hasError={Boolean(form.errors.country)}
      />

      {/* Password */}
      <InputField
        label="Password"
        icon={Lock}
        type="password"
        name="password"
        value={form.values.password}
        onChange={form.handleChange}
        onFocus={form.handleFocus}
        onBlur={form.handleBlur}
        error={form.errors.password}
      />

      {/* Confirm Password */}
      <InputField
        label="Confirm Password"
        icon={Lock}
        type="password"
        name="confirmPassword"
        value={form.values.confirmPassword}
        onChange={form.handleChange}
        onBlur={form.handleBlur}
        error={form.errors.confirmPassword}
      />

      {/* Hidden country input for POST */}
      <input type="hidden" name="country" value={form.values.country} />
    </>
  );
}
