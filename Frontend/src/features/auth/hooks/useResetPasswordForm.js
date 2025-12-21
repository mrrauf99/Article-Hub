import { useState } from "react";
import { isEmpty, validatePassword } from "../util/authValidation";

const INITIAL_VALUES = {
  password: "",
  confirmPassword: "",
};

export function useResetPasswordForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  /* ---------------- Validation ---------------- */

  const validateField = (name, value) => {
    if (isEmpty(value)) {
      return "Please fill out this field.";
    }
    return null;
  };

  const passwordErrors = validatePassword(
    values.password,
    values.confirmPassword
  );

  const validate = () => {
    const newErrors = {};

    const passwordError = validateField("password", values.password);
    const confirmError = validateField(
      "confirmPassword",
      values.confirmPassword
    );

    if (passwordError) newErrors.password = passwordError;
    if (confirmError) newErrors.confirmPassword = confirmError;

    if (Object.values(passwordErrors).includes(false)) {
      newErrors.password = "Invalid password.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- Handlers ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    if (error) {
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  return {
    values,
    errors,
    passwordErrors,
    handleChange,
    handleBlur,
    validate,
  };
}
