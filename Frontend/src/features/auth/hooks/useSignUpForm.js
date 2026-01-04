import { useState } from "react";
import { useAvailability } from "./useAvailability";
import {
  isEmpty,
  isEmailValid,
  validatePassword,
  validateUsername,
} from "../util/authValidation";

const initialValues = {
  name: "",
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  country: "",
};

export function useSignUpForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  /* ---------------- Field validation ---------------- */

  const validateField = (name, value) => {
    if (isEmpty(value)) {
      return "Please fill out this field.";
    }

    switch (name) {
      case "username":
        return validateUsername(value);

      case "email":
        if (!isEmailValid(value)) {
          return "Please enter a valid email.";
        }
        return null;

      case "password":
        if (Object.values(passwordErrors).includes(false)) {
          return "Password does not meet requirements.";
        }
        return null;

      case "confirmPassword":
        if (value !== values.password) {
          return "Passwords do not match.";
        }
        return null;

      default:
        return null;
    }
  };

  /* ---------------- Password validation ---------------- */

  const passwordErrors = validatePassword(
    values.password,
    values.confirmPassword
  );

  /* ---------------- Availability checks ---------------- */

  const isUsernameInvalid =
    isEmpty(values.username) || validateUsername(values.username) !== null;

  const isEmailInvalid = isEmpty(values.email) || !isEmailValid(values.email);

  const usernameCheck = useAvailability(
    values.username,
    isUsernameInvalid,
    "username"
  );

  const emailCheck = useAvailability(values.email, isEmailInvalid, "email");

  /* ---------------- Form validation ---------------- */

  const validate = () => {
    const newErrors = {};

    Object.keys(values).forEach((key) => {
      const error = validateField(key, values[key]);
      if (error) newErrors[key] = error;
    });

    // Only check password requirements if password is not empty
    if (
      !isEmpty(values.password) &&
      Object.values(passwordErrors).includes(false)
    ) {
      newErrors.password = "Invalid password.";
    }

    if (usernameCheck.status === "unavailable") {
      newErrors.username = usernameCheck.message;
    }

    if (emailCheck.status === "unavailable") {
      newErrors.email = emailCheck.message;
    }

    // NETWORK ERROR BLOCK
    if (usernameCheck.status === "error") {
      newErrors.username =
        "Unable to verify username. Please check your connection.";
    }

    if (emailCheck.status === "error") {
      newErrors.email = "Unable to verify email. Please check your connection.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- Handlers ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((v) => ({ ...v, [name]: value }));
    setErrors((e) => ({ ...e, [name]: null }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    setErrors((e) => ({
      ...e,
      [name]: error,
    }));
  };

  return {
    values,
    errors,
    passwordErrors,
    usernameCheck,
    emailCheck,
    handleChange,
    handleBlur,
    validate,
  };
}
