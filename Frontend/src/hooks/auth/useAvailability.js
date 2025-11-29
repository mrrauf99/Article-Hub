import { useState, useEffect } from "react";
import { authApi } from "../../api/authApi";

export function useAvailability(value, didEdit, hasError, type) {
  const [state, setState] = useState({
    status: "idle",
    message: "",
  });

  useEffect(() => {
    // ⛔ Skip availability check if:
    // - user has not blurred yet
    // - OR field is invalid
    // - OR value is empty
    if (!didEdit || hasError) {
      setState({ status: "idle", message: "" });
      return;
    }

    async function checkAvailability() {
      try {
        setState({ status: "checking", message: "" });

        const response =
          type === "email"
            ? await authApi.checkEmail({ email: value })
            : await authApi.checkUsername({ username: value });

        const messages = {
          available: {
            email: "Email is available.",
            username: "Username is available.",
          },
          taken: {
            email: "An account with this email already exists.",
            username: "Username is already taken.",
          },
        };

        const status = response.data.available ? "available" : "taken";

        setState({
          status,
          message: messages[status][type],
        });
      } catch (err) {
        console.error(err);
        setState({
          status: "taken",
          message: "Error checking availability.",
        });
      }
    }

    checkAvailability();
  }, [didEdit, value, hasError, type]);

  return state;
}
