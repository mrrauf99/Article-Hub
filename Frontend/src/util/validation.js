export function isEmailValid(val) {
  return val.includes("@");
}

export function isEmpty(val) {
  return val.trim() === "";
}

export function isEqualsToOtherValue(val, otherVal) {
  return val === otherVal;
}

export function hasMinLength(val, minLength) {
  return val.length >= minLength;
}
