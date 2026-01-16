export const ROLES = {
  STUDENT: "STUDENT",
  LECTURER: "LECTURER",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export function dashboardPathByRole(role: string | undefined | null) {
  if (role === ROLES.LECTURER) return "/dashboard/lecturer";
  return "/dashboard/student";
}
