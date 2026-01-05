import { useState } from "react";
import { isEmpty, isEmailValid } from "../util/authValidation";

const INITIAL_VALUES = {
  email: "",
};

export function useForgotPasswordForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  /* ---------------- Validation ---------------- */

  const validateField = (name, value) => {
    if (isEmpty(value)) {
      return "Please fill out this field.";
    }

    if (!isEmailValid(value)) {
      return "Please enter a valid email address.";
    }

    return null;
  };

  const validate = () => {
    const newErrors = {};
    const error = validateField("email", values.email);

    if (error) newErrors.email = error;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* ---------------- Handlers ---------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues({ [name]: value });

    if (errors[name]) {
      setErrors({});
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);

    if (error) {
      setErrors({ [name]: error });
    }
  };

  return {
    values,
    errors,
    handleChange,
    handleBlur,
    validate,
  };
}
