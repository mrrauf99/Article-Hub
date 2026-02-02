/**
 * Validation utility functions
 */

export function validateRequired(value, fieldName) {
  if (!value || (typeof value === "string" && !value.trim())) {
    throw new Error(`${fieldName} is required`);
  }
  return true;
}

export function validateEmail(email) {
  if (!email) {
    throw new Error("Email is required");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
  return true;
}

export function validateLength(value, min, max, fieldName) {
  if (!value) {
    throw new Error(`${fieldName} is required`);
  }
  if (value.length < min) {
    throw new Error(`${fieldName} must be at least ${min} characters`);
  }
  if (max && value.length > max) {
    throw new Error(`${fieldName} must be at most ${max} characters`);
  }
  return true;
}

// Normalize line breaks: convert Windows \r\n to Unix \n
// This ensures consistent character counting across platforms
const normalizeLineBreaks = (text) =>
  typeof text === "string" ? text.replace(/\r\n/g, "\n") : text;

// Industry standard limits for professional article publishing
const ARTICLE_LIMITS = {
  title: { min: 10, max: 150 },
  introduction: { min: 100, max: 1000 },
  content: { min: 300, max: 100000 },
  summary: { min: 50, max: 500 },
};

export function validateArticleData(data) {
  const errors = [];

  // Normalize all text fields for consistent validation
  const title = normalizeLineBreaks(data.title);
  const introduction = normalizeLineBreaks(data.introduction);
  const content = normalizeLineBreaks(data.content);
  const summary = normalizeLineBreaks(data.summary);

  try {
    validateRequired(title, "Title");
    validateLength(
      title,
      ARTICLE_LIMITS.title.min,
      ARTICLE_LIMITS.title.max,
      "Title",
    );
  } catch (err) {
    errors.push(err.message);
  }

  try {
    validateRequired(introduction, "Introduction");
    validateLength(
      introduction,
      ARTICLE_LIMITS.introduction.min,
      ARTICLE_LIMITS.introduction.max,
      "Introduction",
    );
  } catch (err) {
    errors.push(err.message);
  }

  try {
    validateRequired(content, "Content");
    validateLength(
      content,
      ARTICLE_LIMITS.content.min,
      ARTICLE_LIMITS.content.max,
      "Content",
    );
  } catch (err) {
    errors.push(err.message);
  }

  try {
    validateRequired(summary, "Summary");
    validateLength(
      summary,
      ARTICLE_LIMITS.summary.min,
      ARTICLE_LIMITS.summary.max,
      "Summary",
    );
  } catch (err) {
    errors.push(err.message);
  }

  try {
    validateRequired(data.category, "Category");
  } catch (err) {
    errors.push(err.message);
  }

  return errors;
}

export function validateProfileData(data) {
  const errors = [];

  if (data.name !== undefined) {
    try {
      validateLength(data.name, 2, 100, "Name");
    } catch (err) {
      errors.push(err.message);
    }
  }

  if (data.bio !== undefined && data.bio) {
    try {
      validateLength(data.bio, 0, 500, "Bio");
    } catch (err) {
      errors.push(err.message);
    }
  }

  if (data.expertise !== undefined && data.expertise) {
    try {
      validateLength(data.expertise, 0, 100, "Expertise");
    } catch (err) {
      errors.push(err.message);
    }
  }

  // Validate gender if provided
  if (data.gender !== undefined && data.gender !== null && data.gender !== "") {
    const validGenders = ["male", "female", "other", "prefer_not_to_say"];
    if (!validGenders.includes(data.gender.toLowerCase())) {
      errors.push(
        "Gender must be one of: male, female, other, prefer_not_to_say",
      );
    }
  }

  // Validate URLs
  const urlFields = [
    "portfolio_url",
    "x_url",
    "linkedin_url",
    "instagram_url",
    "facebook_url",
  ];
  urlFields.forEach((field) => {
    if (data[field] !== undefined && data[field]) {
      try {
        const urlRegex = /^https?:\/\/.+/i;
        if (!urlRegex.test(data[field])) {
          errors.push(`${field.replace(/_/g, " ")} must be a valid URL`);
        }
      } catch (err) {
        errors.push(err.message);
      }
    }
  });

  return errors;
}
