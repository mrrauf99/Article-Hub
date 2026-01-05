import { useState, useEffect, useRef, startTransition } from "react";
import { authApi } from "../../api/authApi";

export function useAvailability(value, hasError, type) {
  const [state, setState] = useState({
    status: "idle",
    message: "",
  });
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (!value || hasError) {
        return;
      }
    } else {
      if (!value || hasError) {
        startTransition(() => {
          setState((prev) => ({ ...prev, status: "idle", message: "" }));
        });
        return;
      }
    }

    let isCancelled = false;
    let timeoutId;

    const checkAvailability = async () => {
      setState((prev) => ({
        ...prev,
        status: "checking",
        message: "Checking...",
      }));

      try {
        const endpoint =
          type === "email" ? authApi.checkEmail : authApi.checkUsername;
        const payload =
          type === "email" ? { email: value } : { username: value };

        const res = await endpoint(payload);

        if (!isCancelled) {
          const { available, message } = res.data;
          setState((prev) => ({
            ...prev,
            status: available ? "available" : "unavailable",
            message,
          }));
        }
      } catch (err) {
        if (isCancelled) return;

        const errorMessage =
          err.response?.data?.message ||
          (err.request
            ? "Network error. Please check your connection."
            : "Something went wrong. Please try again.");

        setState((prev) => ({
          ...prev,
          status: "error",
          message: errorMessage,
        }));
      }
    };

    timeoutId = setTimeout(() => {
      checkAvailability();
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [value, hasError, type]);

  return state;
}
