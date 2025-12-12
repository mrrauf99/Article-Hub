import { useState } from "react";

export function useInput(defaultValue, validationFn) {
  const [enteredValue, setEnteredValue] = useState(defaultValue);
  const [didEdit, setDidEdit] = useState(false);

  const isValueValid = validationFn(enteredValue);

  function handleChange(event) {
    if (didEdit) {
      setDidEdit(false);
    }
    setEnteredValue(event.target.value);
  }

  function handleBlur() {
    setDidEdit(true);
  }

  return {
    enteredValue,
    handleChange,
    handleBlur,
    hasError: didEdit && !isValueValid,
    didEdit,
  };
}
