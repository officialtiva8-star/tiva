import { LIMITS } from "../constants/limits.js";

const ALLOWED_POST_VISIBILITY = [
  "public",
  "friends",
  "private"
];

export function validatePostText(text) {
  if (typeof text !== "string") {
    return {
      valid: false,
      message: "Post text must be text."
    };
  }

  const value = text.trim();

  if (value.length > LIMITS.MAX_POST_TEXT_LENGTH) {
    return {
      valid: false,
      message: `Post text cannot exceed ${LIMITS.MAX_POST_TEXT_LENGTH} characters.`
    };
  }

  return {
    valid: true,
    value
  };
}

export function validatePostVisibility(visibility) {
  if (!ALLOWED_POST_VISIBILITY.includes(visibility)) {
    return {
      valid: false,
      message: "Choose public, friends, or private visibility."
    };
  }

  return {
    valid: true,
    value: visibility
  };
}