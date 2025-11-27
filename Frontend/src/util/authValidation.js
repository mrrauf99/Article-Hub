export function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isEmpty(val) {
  return val.trim() === "";
}

export function validatePassword(password, confirmPassword) {
  const errors = [];
  const push = (condition, msg, errors) => {
    if (!condition) errors.push(msg);
  };

  push(
    password.length >= 12,
    "Password must be at least 12 characters.",
    errors
  );

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);

  const groupCount = [hasUpper, hasLower, hasNumber, hasSymbol].filter(
    Boolean
  ).length;

  push(
    groupCount >= 2,
    "Password must contain at least 2 of the following: uppercase letters, lowercase letters, numbers, or symbols.",
    errors
  );

  push(password === confirmPassword, "Passwords do not match.", errors);

  return errors;
}

export function validateUsername(username) {
  const errors = [];
  const push = (condition, msg, errors) => {
    if (!condition) errors.push(msg);
  };

  push(username.length >= 3, "Username must be at least 3 characters.", errors);
  push(username.length <= 20, "Username cannot exceed 20 characters.", errors);
  push(
    /^[a-z0-9_]+$/.test(username),
    "Username can only contain lowercase letters, numbers, and underscores.",
    errors
  );

  return errors[0] || null; // return first error for username
}
