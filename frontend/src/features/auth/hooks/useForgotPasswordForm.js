import { useState } from "react";
import { isEmpty, isEmailValid } from "../util/authValidation";
import { REQUIRED_FIELD_MESSAGE } from "@/utils/validationMessages";

const INITIAL_VALUES = {
  email: "",
};

export function useForgotPasswordForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    if (isEmpty(value)) {
      return REQUIRED_FIELD_MESSAGE;
    }

    if (!isEmailValid(value)) {
      return "Enter a valid email address.";
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
