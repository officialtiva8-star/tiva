import { LIMITS } from "../constants/limits.js";

const USERNAME_PATTERN = /^[a-zA-Z0-9_.]+$/;

export function validateUsername(username) {
  if (typeof username !== "string") {
    return {
      valid: false,
      message: "Username must be text."
    };
  }

  const value = username.trim();

  if (
    value.length < LIMITS.MIN_USERNAME_LENGTH ||
    value.length > LIMITS.MAX_USERNAME_LENGTH
  ) {
    return {
      valid: false,
      message: `Username must contain ${LIMITS.MIN_USERNAME_LENGTH} to ${LIMITS.MAX_USERNAME_LENGTH} characters.`
    };
  }

  if (!USERNAME_PATTERN.test(value)) {
    return {
      valid: false,
      message: "Use only letters, numbers, underscores, and periods."
    };
  }

  return {
    valid: true,
    value: value.toLowerCase()
  };
}

export function validateDisplayName(displayName) {
  if (typeof displayName !== "string") {
    return {
      valid: false,
      message: "Display name must be text."
    };
  }

  const value = displayName.trim();

  if (
    value.length < 1 ||
    value.length > LIMITS.MAX_DISPLAY_NAME_LENGTH
  ) {
    return {
      valid: false,
      message: `Display name must contain 1 to ${LIMITS.MAX_DISPLAY_NAME_LENGTH} characters.`
    };
  }

  return {
    valid: true,
    value
  };
}

export function validateBio(bio) {
  if (typeof bio !== "string") {
    return {
      valid: false,
      message: "Bio must be text."
    };
  }

  const value = bio.trim();

  if (value.length > LIMITS.MAX_BIO_LENGTH) {
    return {
      valid: false,
      message: `Bio cannot exceed ${LIMITS.MAX_BIO_LENGTH} characters.`
    };
  }

  return {
    valid: true,
    value
  };
}