import { ARTICLE_CATEGORIES } from "@/data/articleCategories";

/**
 * Category aliases mapping - maps alternate category names to canonical names
 */
const CATEGORY_ALIASES = {
  Security: "Cyber Security",
  "Cyber Security": "Cyber Security",
};

/**
 * Normalize a category name to its canonical form
 * @param {string} category - Category name to normalize
 * @returns {string} - Canonical category name
 */
export function normalizeCategory(category) {
  if (!category) return category;
  return CATEGORY_ALIASES[category] || category;
}

/**
 * Get the canonical category name if it exists in ARTICLE_CATEGORIES
 * @param {string} category - Category name to check
 * @returns {string|null} - Canonical category name or null if invalid
 */
export function getCanonicalCategory(category) {
  if (!category) return null;
  const normalized = normalizeCategory(category);
  return ARTICLE_CATEGORIES.includes(normalized) ? normalized : null;
}
