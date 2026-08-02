/**
 * Extract query parameters from request
 */
export function getQueryParams(request, defaults = {}) {
  const url = new URL(request.url);
  return Object.entries(defaults).reduce((params, [key, defaultValue]) => {
    params[key] = url.searchParams.get(key) || defaultValue;
    return params;
  }, {});
}
