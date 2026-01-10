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

export function validateArticleData(data) {
  const errors = [];

  try {
    validateRequired(data.title, "Title");
    validateLength(data.title, 5, 200, "Title");
  } catch (err) {
    errors.push(err.message);
  }

  try {
    validateRequired(data.introduction, "Introduction");
    validateLength(data.introduction, 50, 500, "Introduction");
  } catch (err) {
    errors.push(err.message);
  }

  try {
    validateRequired(data.content, "Content");
    validateLength(data.content, 100, 50000, "Content");
  } catch (err) {
    errors.push(err.message);
  }

  try {
    validateRequired(data.summary, "Summary");
    validateLength(data.summary, 20, 300, "Summary");
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
      errors.push("Gender must be one of: male, female, other, prefer_not_to_say");
    }
  }

  // Validate URLs
  const urlFields = ["portfolio_url", "x_url", "linkedin_url", "instagram_url", "facebook_url"];
  urlFields.forEach(field => {
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
