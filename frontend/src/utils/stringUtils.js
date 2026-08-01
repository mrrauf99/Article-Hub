/**
 * Capitalizes the first letter of a string.
 * Example: "industrial training" -> "Industrial training"
 */
export function capitalizeFirstLetter(str) {
  if (!str || typeof str !== "string") return "";
  const trimmed = str.trimStart();
  if (!trimmed) return "";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}
