import { useState } from "react";
import { useAvailability } from "./useAvailability";
import { isEmpty, validateUsername } from "../util/authValidation";
import { REQUIRED_FIELD_MESSAGE } from "@/utils/validationMessages";

export function useUsernameForm() {
  const [values, setValues] = useState({ username: "" });
  const [errors, setErrors] = useState({});

  const validateField = (value) => {
    if (isEmpty(value)) {
      return REQUIRED_FIELD_MESSAGE;
    }

    return validateUsername(value);
  };

  const isUsernameInvalid =
    isEmpty(values.username) || validateUsername(values.username) !== null;

  const usernameCheck = useAvailability(
    values.username,
    isUsernameInvalid,
    "username"
  );

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

    if (usernameCheck.status === "error") {
      setErrors({ username: usernameCheck.message });
      return false;
    }

    setErrors({});
    return true;
  };

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
