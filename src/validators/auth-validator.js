export function validateEmail(email) {
  if (typeof email !== "string") {
    return {
      valid: false,
      message: "Please enter a valid email address."
    };
  }

  const value = email.trim().toLowerCase();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(value) || value.length > 254) {
    return {
      valid: false,
      message: "Please enter a valid email address."
    };
  }

  return {
    valid: true,
    value
  };
}

export function validatePassword(password) {
  if (typeof password !== "string") {
    return {
      valid: false,
      message: "Password must be text."
    };
  }

  if (password.length < 8) {
    return {
      valid: false,
      message: "Your password must contain at least 8 characters."
    };
  }

  if (password.length > 128) {
    return {
      valid: false,
      message: "Your password cannot exceed 128 characters."
    };
  }

  return {
    valid: true,
    value: password
  };
}

export function validatePhoneNumber(phone) {
  if (typeof phone !== "string") {
    return {
      valid: false,
      message: "Please enter your phone number with country code."
    };
  }

  const value = phone.trim();

  const phonePattern = /^\+[1-9]\d{7,14}$/;

  if (!phonePattern.test(value)) {
    return {
      valid: false,
      message: "Use international format, for example +233XXXXXXXXX."
    };
  }

  return {
    valid: true,
    value
  };
}