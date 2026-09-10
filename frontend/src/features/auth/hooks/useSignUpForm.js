import { useState } from "react";
import { useAvailability } from "./useAvailability";
import { REQUIRED_FIELD_MESSAGE } from "@/utils/validationMessages";
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
      return !value ? REQUIRED_FIELD_MESSAGE : null;
    }

    if (isEmpty(value)) return REQUIRED_FIELD_MESSAGE;

    switch (name) {
      case "username":
        return validateUsername(value);
      case "email":
        return !isEmailValid(value) ? "Enter a valid email address." : null;
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
          newErrors.password = REQUIRED_FIELD_MESSAGE;
        } else {
          const passwordError = getPasswordGenericError(currentPasswordErrors, values.password);
          if (passwordError) newErrors.password = passwordError;
        }
      } else if (key === "country") {
        if (!values[key]) {
          newErrors[key] = REQUIRED_FIELD_MESSAGE;
        }
      } else {
        const error = validateField(key, values[key], values.password, values.confirmPassword);
        if (error) newErrors[key] = error;
      }
    });

    if (usernameCheck.status === "unavailable") newErrors.username = usernameCheck.message;
    if (emailCheck.status === "unavailable") newErrors.email = emailCheck.message;
    if (usernameCheck.status === "error") {
      newErrors.username = usernameCheck.message;
    }
    if (emailCheck.status === "error") {
      newErrors.email = emailCheck.message;
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
        setErrors((e) => ({ ...e, [name]: REQUIRED_FIELD_MESSAGE }));
      } else {
        const currentPasswordErrors = validatePassword(value, values.confirmPassword);
        const error = getPasswordGenericError(currentPasswordErrors, value);
        setErrors((e) => ({ ...e, [name]: error }));
      }
    } else if (name === "confirmPassword") {
      const error = isEmpty(value)
        ? REQUIRED_FIELD_MESSAGE
        : value !== values.password
        ? "Passwords do not match."
        : null;
      setErrors((e) => ({ ...e, [name]: error }));
    } else if (name === "country") {
      const countryValue = value !== undefined ? value : values.country;
      const error = !countryValue ? REQUIRED_FIELD_MESSAGE : null;
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
