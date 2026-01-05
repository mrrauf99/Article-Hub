import { useState } from "react";
import { useAvailability } from "./useAvailability";
import { isEmpty, validateUsername } from "../util/authValidation";

export function useUsernameForm() {
  const [values, setValues] = useState({ username: "" });
  const [errors, setErrors] = useState({});

  /* ---------------- Field validation ---------------- */

  const validateField = (value) => {
    if (isEmpty(value)) {
      return "Please fill out this field.";
    }

    return validateUsername(value);
  };

  /* ---------------- Availability check ---------------- */

  const isUsernameInvalid =
    isEmpty(values.username) || validateUsername(values.username) !== null;

  const usernameCheck = useAvailability(
    values.username,
    isUsernameInvalid,
    "username"
  );

  /* ---------------- Form validation ---------------- */

  const validate = () => {
    const error = validateField(values.username);

    if (error) {
      setErrors({ username: error });
      return false;
    }

    if (usernameCheck.status === "unavailable") {
      setErrors({ username: usernameCheck.message });
      return false;
    }

    // NETWORK ERROR BLOCK
    if (usernameCheck.status === "error") {
      setErrors({
        username: "Unable to verify username. Please check your connection.",
      });
      return false;
    }

    setErrors({});
    return true;
  };

  /* ---------------- Handlers ---------------- */

  const handleChange = (e) => {
    const { value } = e.target;

    setValues({ username: value });
    setErrors({});
  };

  const handleBlur = () => {
    const error = validateField(values.username);
    setErrors({ username: error });
  };

  return {
    values,
    errors,
    usernameCheck,
    handleChange,
    handleBlur,
    validate,
  };
}
