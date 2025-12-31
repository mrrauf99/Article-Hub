import { redirect } from "react-router-dom";

/**
 * Handle common loader errors
 * Redirects to login on 401, to user dashboard on 403, and throws 500 for other errors
 */
export function handleLoaderError(error, errorMessage = "Failed to load data") {
  if (error.response?.status === 401) {
    return redirect("/login");
  }
  if (error.response?.status === 403) {
    return redirect("/user/dashboard");
  }
  console.error(errorMessage, error);
  throw new Response(errorMessage, { status: 500 });
}

/**
 * Extract query parameters from request URL
 */
export function getQueryParams(request, defaults = {}) {
  const url = new URL(request.url);
  return Object.entries(defaults).reduce((params, [key, defaultValue]) => {
    params[key] = url.searchParams.get(key) || defaultValue;
    return params;
  }, {});
}
