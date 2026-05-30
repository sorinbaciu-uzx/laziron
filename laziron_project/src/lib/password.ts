/**
 * Password policy: minimum 8 characters, must contain at least one uppercase
 * letter and one digit. Lowercase and special characters are optional.
 */
export function validatePassword(password: string): { ok: true } | { ok: false; error: string } {
  if (password.length < 8) return { ok: false, error: "password_short" };
  if (!/[A-Z]/.test(password)) return { ok: false, error: "password_no_uppercase" };
  if (!/[0-9]/.test(password)) return { ok: false, error: "password_no_digit" };
  return { ok: true };
}

/** Client-side HTML pattern attribute equivalent: 8+, ≥1 upper, ≥1 digit. */
export const PASSWORD_PATTERN = "(?=.*[A-Z])(?=.*\\d).{8,}";
