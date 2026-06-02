import type { AuthenticatedUser } from "@/commons/types";

const ADMIN_ROLE = "ROLE_ADMIN";

export function userHasRole(
  user: AuthenticatedUser | undefined,
  role: string,
): boolean {
  if (!user?.authorities?.length) {
    return false;
  }
  return user.authorities.some((item) => item.authority === role);
}

export function isAdmin(user: AuthenticatedUser | undefined): boolean {
  return userHasRole(user, ADMIN_ROLE);
}

export function getPostLoginPath(user: AuthenticatedUser | undefined): string {
  return isAdmin(user) ? "/admin" : "/";
}
