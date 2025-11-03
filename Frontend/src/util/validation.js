export function isEmailValid(val) {
  return val.includes("@");
}

export function isEmpty(val) {
  return val.trim() === "";
}

export function hasMinLength(val, minLength) {
  return val.length >= minLength;
}

export function isUsernameValid(value) {
  return /^(?!-)(?!.*--)[a-zA-Z0-9-]{4,20}(?<!-)$/.test(value);
}

export function isPasswordValid(value) {
  // At least one lowercase, one uppercase, one number, one special char, and min 8 characters
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{8,}$/;

  return passwordPattern.test(value);
}
