export function isEmailValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isEmpty(val) {
  return val.trim() === "";
}

export function validatePassword(password, confirmPassword) {
  const passwordErrors = {
    minLength: password.length >= 8,
    maxLength: password.length <= 64,
    hasUpper: /[A-Z]/.test(password),
    hasLower: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
    match: password === confirmPassword && password !== "",
  };

  return passwordErrors;
}

export function validateUsername(username) {
  if (username.length < 3) return "Username must be at least 3 characters.";
  if (username.length > 20) return "Username cannot exceed 20 characters.";
  if (!/^[a-z0-9_]+$/.test(username))
    return "Username can only contain lowercase letters, numbers, and underscores.";

  return null;
}
