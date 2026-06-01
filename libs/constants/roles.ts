export const ROLES = {
  ADMIN: "ADMIN",
  STUDENT: "STUDENT",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
