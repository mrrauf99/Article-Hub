import { useState } from "react";
import { isEmpty, validatePassword, getPasswordGenericError } from "../util/authValidation";

const INITIAL_VALUES = {
  password: "",
  confirmPassword: "",
};

export function useResetPasswordForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  const passwordErrors = validatePassword(values.password, values.confirmPassword);

  const validate = () => {
    const newErrors = {};
    const currentPasswordErrors = validatePassword(values.password, values.confirmPassword);

    if (isEmpty(values.password)) {
      newErrors.password = "Please fill out this field.";
    } else {
      const passwordError = getPasswordGenericError(currentPasswordErrors, values.password);
      if (passwordError) newErrors.password = passwordError;
    }

    if (isEmpty(values.confirmPassword)) {
      newErrors.confirmPassword = "Please fill out this field.";
    } else if (values.confirmPassword !== values.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    if (name === "password") {
      setErrors((prev) => ({ ...prev, password: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => {
      const newValues = { ...prev, [name]: value };

      if (name === "password") {
        if (prev.confirmPassword?.length) {
          const confirmError = value !== prev.confirmPassword ? "Passwords do not match." : null;
          setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: confirmError }));
        }
      } else if (name === "confirmPassword") {
        const confirmError = value.length > 0
          ? (value !== prev.password ? "Passwords do not match." : null)
          : null;
        setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: confirmError }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
      }

      return newValues;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      const currentPasswordErrors = validatePassword(value, values.confirmPassword);
      const error = isEmpty(value) ? "Please fill out this field." : getPasswordGenericError(currentPasswordErrors, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    } else if (name === "confirmPassword") {
      const error = isEmpty(value)
        ? "Please fill out this field."
        : value !== values.password
        ? "Passwords do not match."
        : null;
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  return {
    values,
    errors,
    passwordErrors,
    handleChange,
    handleFocus,
    handleBlur,
    validate,
  };
}
