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

/**
 * Strips the Markdown syntax produced by MarkdownEditor (headings, bold,
 * italic, links, lists, quotes, code) for contexts that render plain text
 * instead of going through ReactMarkdown, e.g. card/list/table summaries.
 */
export function stripMarkdown(str) {
  if (!str || typeof str !== "string") return "";

  return str
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/^\s{0,3}#{1,6}\s+/gm, "")
    .replace(/(\*\*\*|___)(.*?)\1/g, "$2")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/^\s{0,3}>\s?/gm, "")
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}
