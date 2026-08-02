import { redirect } from "react-router-dom";

/**
 * Shared error handler for route loaders and actions:
 * - Redirects 401 Unauthorized status to /login
 * - Redirects 403 Forbidden status to a configurable route
 * - Re-throws unhandled HTTP errors for React Router error elements
 */
export function handleLoaderError(
  error,
  {
    forbiddenRedirect = null,
    fallbackMessage = "Something went wrong. Please try again.",
    fallbackStatus,
  } = {},
) {
  const status = error?.response?.status;

  if (status === 401) {
    return redirect("/login");
  }

  if (status === 403 && forbiddenRedirect) {
    return redirect(forbiddenRedirect);
  }

  throw new Response(fallbackMessage, {
    status: fallbackStatus || status || 500,
  });
}
