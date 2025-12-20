import { useState } from "react";

export function useContactForm(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const validateField = (name, value) => {
    if (!value || value.trim() === "") {
      return "Please fill out this field.";
    }

    switch (name) {
      case "name":
        if (value.trim().length < 2)
          return "Name must be at least 2 characters";
        break;

      case "email":
        if (!/^\S+@\S+\.\S+$/.test(value)) return "Invalid email address";
        break;

      case "subject":
        if (value.trim().length < 3)
          return "Subject must be at least 3 characters";
        break;

      case "message":
        if (value.trim().length < 10)
          return "Message must be at least 10 characters";
        break;

      default:
        return null;
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

  const reset = () => {
    setValues(initialValues);
    setErrors({});
  };

  return {
    values,
    errors,
    handleChange,
    handleBlur,
    validate,
    reset,
  };
}
