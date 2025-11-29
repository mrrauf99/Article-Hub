import { useInput } from "./useInput";

import {
  isEmpty,
  isEmailValid,
  validatePassword,
  validateUsername,
} from "../../util/authValidation";

export function useSignUpForm() {
  const name = useInput("", (v) => !isEmpty(v));
  const username = useInput("", (v) => !isEmpty(v));
  const email = useInput("", (v) => !isEmpty(v));
  const password = useInput("", (v) => !isEmpty(v));
  const confirmPassword = useInput("", (v) => !isEmpty(v));
  const country = useInput("", (v) => !isEmpty(v));

  const usernameError =
    (username.hasError && "Please fill out this field.") ||
    (username.enteredValue && validateUsername(username.enteredValue));

  const emailError =
    (email.hasError && "Please fill out this field.") ||
    (email.enteredValue &&
      !isEmailValid(email.enteredValue) &&
      "Please enter a valid email.");

  const passwordErrors = validatePassword(
    password.enteredValue,
    confirmPassword.enteredValue
  );

  return {
    name,
    username,
    email,
    password,
    confirmPassword,
    country,
    usernameError,
    emailError,
    passwordErrors,
  };
}
