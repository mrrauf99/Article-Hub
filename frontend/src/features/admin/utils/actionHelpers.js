const VERB = {
  approve: "approve the article",
  reject: "reject the article",
  delete: "delete it",
  changeRole: "change the role",
};

// Prefers the server's message when one was sent.
export function handleActionError(error, action = "operation") {
  console.error(`Failed to ${action}:`, error);
  const status = error.response?.status;
  const serverMessage = error.response?.data?.message;
  const verb = VERB[action] || "save the change";

  let message;
  if (!error.response) {
    message = `Couldn't reach Article Hub to ${verb}. Check your connection and try again.`;
  } else if (status === 401) {
    message = "Your session has expired. Log in again, then retry.";
  } else if (status === 403) {
    message = serverMessage || "Your account isn't allowed to do this any more.";
  } else if (status === 404) {
    message = "It no longer exists. Another admin may have deleted it; the list will refresh.";
  } else if (status === 429) {
    message = "Too many requests in a short time. Wait a minute, then try again.";
  } else {
    message = serverMessage || `The server couldn't ${verb}. Try again in a moment.`;
  }

  return { success: false, message };
}

export function handleActionSuccess(message = "Operation completed successfully") {
  return { success: true, message };
}
