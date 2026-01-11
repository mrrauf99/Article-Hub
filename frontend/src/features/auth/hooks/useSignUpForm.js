import { useState } from "react";
import { useAvailability } from "./useAvailability";
import {
  isEmpty,
  isEmailValid,
  validatePassword,
  validateUsername,
  getPasswordGenericError,
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

  const passwordErrors = validatePassword(values.password, values.confirmPassword);

  const validateField = (name, value, passwordToCheck = values.password, confirmPasswordToCheck = values.confirmPassword) => {
    if (name === "country") {
      return !value ? "Please fill out this field." : null;
    }
    
    if (isEmpty(value)) return "Please fill out this field.";

    switch (name) {
      case "username":
        return validateUsername(value);
      case "email":
        return !isEmailValid(value) ? "Please enter a valid email." : null;
      case "password": {
        const freshPasswordErrors = validatePassword(value, confirmPasswordToCheck);
        return getPasswordGenericError(freshPasswordErrors, value);
      }
      case "confirmPassword":
        return value !== passwordToCheck ? "Passwords do not match." : null;
      default:
        return null;
    }
  };

  const isUsernameInvalid = isEmpty(values.username) || validateUsername(values.username) !== null;
  const isEmailInvalid = isEmpty(values.email) || !isEmailValid(values.email);

  const usernameCheck = useAvailability(values.username, isUsernameInvalid, "username");
  const emailCheck = useAvailability(values.email, isEmailInvalid, "email");

  const validate = () => {
    const newErrors = {};
    const currentPasswordErrors = validatePassword(values.password, values.confirmPassword);

    Object.keys(values).forEach((key) => {
      if (key === "password") {
        if (isEmpty(values.password)) {
          newErrors.password = "Please fill out this field.";
        } else {
          const passwordError = getPasswordGenericError(currentPasswordErrors, values.password);
          if (passwordError) newErrors.password = passwordError;
        }
      } else if (key === "country") {
        if (!values[key]) {
          newErrors[key] = "Please fill out this field.";
        }
      } else {
        const error = validateField(key, values[key], values.password, values.confirmPassword);
        if (error) newErrors[key] = error;
      }
    });

    if (usernameCheck.status === "unavailable") newErrors.username = usernameCheck.message;
    if (emailCheck.status === "unavailable") newErrors.email = emailCheck.message;
    if (usernameCheck.status === "error") {
      newErrors.username = "Unable to verify username. Please check your connection.";
    }
    if (emailCheck.status === "error") {
      newErrors.email = "Unable to verify email. Please check your connection.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFocus = (e) => {
    const { name } = e.target;
    if (name === "password") {
      setErrors((e) => ({ ...e, password: null }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((v) => {
      const newValues = { ...v, [name]: value };

      if (name === "password") {
        if (v.confirmPassword?.length) {
          const confirmError = value !== v.confirmPassword ? "Passwords do not match." : null;
          setErrors((e) => ({ ...e, confirmPassword: confirmError }));
        }
      } else if (name === "confirmPassword") {
        const confirmError = value.length > 0
          ? (value !== v.password ? "Passwords do not match." : null)
          : null;
        setErrors((e) => ({ ...e, confirmPassword: confirmError }));
      } else {
        setErrors((e) => ({ ...e, [name]: null }));
      }

      return newValues;
    });
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      if (isEmpty(value)) {
        setErrors((e) => ({ ...e, [name]: "Please fill out this field." }));
      } else {
        const currentPasswordErrors = validatePassword(value, values.confirmPassword);
        const error = getPasswordGenericError(currentPasswordErrors, value);
        setErrors((e) => ({ ...e, [name]: error }));
      }
    } else if (name === "confirmPassword") {
      const error = isEmpty(value)
        ? "Please fill out this field."
        : value !== values.password
        ? "Passwords do not match."
        : null;
      setErrors((e) => ({ ...e, [name]: error }));
    } else if (name === "country") {
      const error = !value ? "Please fill out this field." : null;
      setErrors((e) => ({ ...e, [name]: error }));
    } else {
      const error = validateField(name, value, values.password, values.confirmPassword);
      setErrors((e) => ({ ...e, [name]: error }));
    }
  };

  return {
    values,
    errors,
    passwordErrors,
    usernameCheck,
    emailCheck,
    handleChange,
    handleFocus,
    handleBlur,
    validate,
  };
}
