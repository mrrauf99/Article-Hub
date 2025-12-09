import { useInput } from "./useInput";
import { useAvailability } from "./useAvailability";

import {
  isEmpty,
  isEmailValid,
  validatePassword,
  validateUsername,
} from "../util/authValidation";

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
    (email.didEdit &&
      !email.hasError &&
      !isEmailValid(email.enteredValue) &&
      "Please enter a valid email.");

  const passwordErrors = validatePassword(
    password.enteredValue,
    confirmPassword.enteredValue
  );

  const usernameCheck = useAvailability(
    username.enteredValue,
    username.didEdit,
    usernameError,
    "username"
  );

  const emailCheck = useAvailability(
    email.enteredValue,
    email.didEdit,
    emailError,
    "email"
  );

  const isInvalidForm =
    name.hasError ||
    usernameError ||
    emailError ||
    password.hasError ||
    confirmPassword.hasError ||
    country.hasError ||
    Object.values(passwordErrors).some((v) => v === false) ||
    usernameCheck.status === "taken" ||
    emailCheck.status === "taken" ||
    isEmpty(name.enteredValue) ||
    isEmpty(username.enteredValue) ||
    isEmpty(email.enteredValue) ||
    isEmpty(password.enteredValue) ||
    isEmpty(confirmPassword.enteredValue) ||
    isEmpty(country.enteredValue);

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
    isInvalidForm,
    usernameCheck,
    emailCheck,
  };
}
