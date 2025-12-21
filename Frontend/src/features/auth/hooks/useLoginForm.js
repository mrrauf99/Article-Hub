import { useState } from "react";
import { isEmpty } from "../util/authValidation";

const INITIAL_VALUES = {
  identifier: "",
  password: "",
};

export function useLoginForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  /* ---------------- Field validation ---------------- */

  const validateField = (name, value) => {
    if (isEmpty(value)) {
      return "Please fill out this field.";
    }

    if (name === "password") {
      if (value.length < 8) {
        return "Password must be at least 8 characters.";
      }
      if (value.length > 64) {
        return "Password must be less than 64 characters.";
      }
    }

    return null;
  };

  /* ---------------- Form validation ---------------- */

  const validate = () => {
    const newErrors = {};

    Object.keys(values).forEach((key) => {
      const error = validateField(key, values[key]);
      if (error) newErrors[key] = error;
    });

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

    // clear error on change
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
    handleChange,
    handleBlur,
    validate,
  };
}
