export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 64;

const ARTICLE_LIMITS = {
  title: { min: 10, max: 150 },
  introduction: { min: 100, max: 1000 },
  content: { min: 300, max: 100000 },
  summary: { min: 50, max: 500 },
};

const PROFILE_LIMITS = {
  name: { min: 2, max: 100 },
  bio: { max: 500 },
  expertise: { max: 100 },
};

export const CONTACT_LIMITS = {
  name: { min: 2, max: 100 },
  subject: { min: 5, max: 200 },
  message: { min: 10, max: 2000 },
};

const VALID_GENDERS = ["male", "female", "other", "prefer_not_to_say"];

// Convert Windows (\r\n) to Unix (\n), collapse 3+ consecutive newlines to 2, and capitalize first letter.
function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  const cleaned = value.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  return cleaned ? cleaned.charAt(0).toUpperCase() + cleaned.slice(1) : "";
}

function isValidUrl(value) {
  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateRequired(value, fieldName) {
  const text = normalizeText(value);

  if (!text) {
    return `${fieldName} is required.`;
  }

  return null;
}

// Validate Length
export function validateLength(value, min, max, fieldName) {
  const text = normalizeText(value);

  if (!text) {
    return `${fieldName} is required.`;
  }

  if (text.length < min) {
    return `${fieldName} must be at least ${min} characters.`;
  }

  if (text.length > max) {
    return `${fieldName} must be at most ${max} characters.`;
  }

  return null;
}

// Validate Email
export function validateEmail(email) {
  const value = normalizeText(email);

  if (!value) {
    return "Email is required.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(value)) {
    return "Invalid email format.";
  }

  return null;
}

function validateUsername(username) {
  if (!username) return "Username is required.";
  const str = String(username);
  if (str.length < 3) return "Username must be at least 3 characters.";
  if (str.length > 20) return "Username cannot exceed 20 characters.";
  if (!/^[a-z0-9_]+$/.test(str))
    return "Username can only contain lowercase letters, numbers, and underscores.";

  return null;
}

// Article Validation
export function validateArticleData(data) {
  const errors = [];

  const fields = [
    ["title", ARTICLE_LIMITS.title],
    ["introduction", ARTICLE_LIMITS.introduction],
    ["content", ARTICLE_LIMITS.content],
    ["summary", ARTICLE_LIMITS.summary],
  ];

  for (const [field, limits] of fields) {
    const label = field.charAt(0).toUpperCase() + field.slice(1);

    const error = validateLength(data[field], limits.min, limits.max, label);

    if (error) {
      errors.push(error);
    }
  }

  const categoryError = validateRequired(data.category, "Category");

  if (categoryError) {
    errors.push(categoryError);
  }

  return errors;
}

// Profile Validation
export function validateProfileData(data) {
  const errors = [];

  if (data.name !== undefined) {
    const error = validateLength(
      data.name,
      PROFILE_LIMITS.name.min,
      PROFILE_LIMITS.name.max,
      "Name",
    );

    if (error) {
      errors.push(error);
    }
  }

  if (data.bio !== undefined && normalizeText(data.bio) !== "") {
    const error = validateLength(data.bio, 0, PROFILE_LIMITS.bio.max, "Bio");

    if (error) {
      errors.push(error);
    }
  }

  if (data.expertise !== undefined && normalizeText(data.expertise) !== "") {
    const error = validateLength(
      data.expertise,
      0,
      PROFILE_LIMITS.expertise.max,
      "Expertise",
    );

    if (error) {
      errors.push(error);
    }
  }

  if (data.gender !== undefined && normalizeText(data.gender) !== "") {
    if (!VALID_GENDERS.includes(data.gender.toLowerCase())) {
      errors.push(`Gender must be one of: ${VALID_GENDERS.join(", ")}.`);
    }
  }

  const urlFields = [
    "portfolio_url",
    "linkedin_url",
    "x_url",
    "instagram_url",
    "facebook_url",
  ];

  for (const field of urlFields) {
    const value = normalizeText(data[field]);

    if (value && !isValidUrl(value)) {
      errors.push(`${field.replace(/_/g, " ")} must be a valid URL.`);
    }
  }

  return errors;
}

// Signup Validation
export function validateSignupData(data) {
  const errors = [];

  const emailError = validateEmail(data.email);
  if (emailError) errors.push(emailError);

  const usernameError = validateUsername(data.username);
  if (usernameError) errors.push(usernameError);

  const nameError = validateRequired(data.name, "Name");
  if (nameError) errors.push(nameError);

  const countryError = validateRequired(data.country, "Country");
  if (countryError) errors.push(countryError);

  const passwordError = validateLength(
    data.password,
    PASSWORD_MIN,
    PASSWORD_MAX,
    "Password",
  );
  if (passwordError) errors.push(passwordError);

  return errors;
}
