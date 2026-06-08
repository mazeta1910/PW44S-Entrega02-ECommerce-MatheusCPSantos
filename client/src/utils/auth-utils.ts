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

export function getUserDisplayName(user: AuthenticatedUser | undefined): string {
  if (!user) {
    return "Usuário";
  }
  return user.fullName?.trim() || user.email || "Usuário";
}

const USER_AVATARS: Record<string, string> = {
  "enzo@nexus.com.br": "/users/enzo-profile.png",
};

export function getUserAvatarUrl(
  user: AuthenticatedUser | undefined,
): string | null {
  if (!user?.email) {
    return null;
  }

  return USER_AVATARS[user.email.toLowerCase()] ?? null;
}

export function getUserInitial(user: AuthenticatedUser | undefined): string {
  const label = getUserDisplayName(user);
  return label.charAt(0).toUpperCase();
}
