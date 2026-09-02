import { ARTICLE_CATEGORIES } from "@/data/articleCategories";

const CATEGORY_ALIASES = {
  Security: "Cyber Security",
  "Cyber Security": "Cyber Security",
};

export function normalizeCategory(category) {
  if (!category) return category;
  return CATEGORY_ALIASES[category] || category;
}

export function getCanonicalCategory(category) {
  if (!category) return null;
  const normalized = normalizeCategory(category);
  return ARTICLE_CATEGORIES.includes(normalized) ? normalized : null;
}
