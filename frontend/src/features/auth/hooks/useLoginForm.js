import { useState } from "react";
import { isEmpty } from "../util/authValidation";
import { REQUIRED_FIELD_MESSAGE } from "@/utils/validationMessages";

const INITIAL_VALUES = {
  identifier: "",
  password: "",
};

export function useLoginForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    if (isEmpty(value)) {
      return REQUIRED_FIELD_MESSAGE;
    }

    if (name === "password") {
      if (value.length < 8) {
        return "Password must be at least 8 characters.";
      }
      if (value.length > 64) {
        return "Password must be 64 characters or fewer.";
      }
    }

    return null;
  };

  const validate = () => {
    const newErrors = {};

    Object.keys(values).forEach((key) => {
      const error = validateField(key, values[key]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handlePasswordReset = () => {
    setValues((prev) => ({ ...prev, password: "" }));
  };

  return {
    values,
    errors,
    handleChange,
    handleBlur,
    validate,
    handlePasswordReset,
  };
}
