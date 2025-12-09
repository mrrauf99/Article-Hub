import { useState, useEffect } from "react";
import { authApi } from "../../api/authApi";

export function useAvailability(value, didEdit, hasError, type) {
  const [state, setState] = useState({
    status: "idle",
    message: "",
  });

  useEffect(() => {
    if ((!didEdit && !value) || hasError) {
      setState({ status: "idle", message: "" });
      return;
    }

    let isCancelled = false;

    const checkAvailability = async () => {
      setState({ status: "checking", message: "Checking..." });

      try {
        const endpoint =
          type === "email" ? authApi.checkEmail : authApi.checkUsername;
        const payload =
          type === "email" ? { email: value } : { username: value };

        const res = await endpoint(payload);

        if (!isCancelled) {
          const { available, message } = res.data;
          setState({
            status: available ? "available" : "unavailable",
            message,
          });
        }
      } catch (err) {
        if (isCancelled) return;

        const errorMessage =
          err.response?.data?.message ||
          (err.request
            ? "Network error. Please check your connection."
            : "Something went wrong. Please try again.");

        setState({
          status: "error",
          message: errorMessage,
        });
      }
    };

    checkAvailability();

    return () => {
      isCancelled = true;
    };
  }, [value, didEdit]);

  return state;
}
