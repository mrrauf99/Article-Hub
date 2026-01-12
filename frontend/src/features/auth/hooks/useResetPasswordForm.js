import { useState, useCallback, useMemo } from "react";
import { isEmpty, validatePassword, getPasswordGenericError } from "../util/authValidation";

const INITIAL_VALUES = {
  password: "",
  confirmPassword: "",
};

const FIELD_NAMES = {
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirmPassword",
};

export function useResetPasswordForm() {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({});

  const passwordErrors = useMemo(
    () => validatePassword(values.password, values.confirmPassword),
    [values.password, values.confirmPassword]
  );

  const validate = useCallback(() => {
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
  }, [values.password, values.confirmPassword]);

  const handleFocus = useCallback((e) => {
    const { name } = e.target;
    setErrors((prev) => (prev[name] ? { ...prev, [name]: null } : prev));
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;

    setValues((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      // Re-evaluate confirmPassword error when password changes
      if (name === FIELD_NAMES.PASSWORD && prev.confirmPassword) {
        setErrors((err) => {
          // If passwords now match, clear confirmPassword error
          if (err.confirmPassword && value === prev.confirmPassword) {
            return { ...err, confirmPassword: null };
          }
          // If passwords don't match and confirmPassword has a value, set error
          if (value !== prev.confirmPassword && prev.confirmPassword) {
            return { ...err, confirmPassword: "Passwords do not match." };
          }
          return err;
        });
      }

      return next;
    });

    // Clear error when user starts typing
    setErrors((prev) => (prev[name] ? { ...prev, [name]: null } : prev));
  }, []);

  const handleBlur = useCallback(
    (e) => {
      const { name, value } = e.target;

      if (name === FIELD_NAMES.PASSWORD) {
        const currentPasswordErrors = validatePassword(value, values.confirmPassword);
        const error = isEmpty(value)
          ? "Please fill out this field."
          : getPasswordGenericError(currentPasswordErrors, value);
        setErrors((prev) => ({ ...prev, [name]: error }));
      } else if (name === FIELD_NAMES.CONFIRM_PASSWORD) {
        const error = isEmpty(value)
          ? "Please fill out this field."
          : value !== values.password
          ? "Passwords do not match."
          : null;
        setErrors((prev) => ({ ...prev, [name]: error }));
      }
    },
    [values.password, values.confirmPassword]
  );

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
