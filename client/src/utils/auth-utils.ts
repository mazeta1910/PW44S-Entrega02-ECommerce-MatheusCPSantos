import type { AuthenticatedUser } from "@/commons/types";

const ADMIN_ROLE = "ROLE_ADMIN";
const AVATAR_STORAGE_KEY = "user_avatars";

const USER_AVATARS: Record<string, string> = {
  "enzo@nexus.com.br": "/users/enzo-profile.png",
};

export const USER_AVATAR_UPDATED_EVENT = "userAvatarUpdated";

function getStoredAvatars(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(AVATAR_STORAGE_KEY) ?? "{}") as Record<
      string,
      string
    >;
  } catch {
    return {};
  }
}

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

export function getUserAvatarUrl(
  user: AuthenticatedUser | undefined,
): string | null {
  if (!user?.email) {
    return null;
  }

  const email = user.email.toLowerCase();
  const stored = getStoredAvatars()[email];

  if (stored) {
    return stored;
  }

  return USER_AVATARS[email] ?? null;
}

export function setUserAvatarUrl(email: string, dataUrl: string): void {
  const avatars = getStoredAvatars();
  avatars[email.toLowerCase()] = dataUrl;
  localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(avatars));
  window.dispatchEvent(new CustomEvent(USER_AVATAR_UPDATED_EVENT));
}

export function removeUserAvatarUrl(email: string): void {
  const avatars = getStoredAvatars();
  delete avatars[email.toLowerCase()];
  localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(avatars));
  window.dispatchEvent(new CustomEvent(USER_AVATAR_UPDATED_EVENT));
}

export function hasCustomUserAvatar(email?: string | null): boolean {
  if (!email) {
    return false;
  }

  return Boolean(getStoredAvatars()[email.toLowerCase()]);
}

export function getUserInitial(user: AuthenticatedUser | undefined): string {
  const label = getUserDisplayName(user);
  return label.charAt(0).toUpperCase();
}

export function syncAuthenticatedUserName(fullName: string): void {
  const storage = localStorage.getItem("user")
    ? localStorage
    : sessionStorage.getItem("user")
      ? sessionStorage
      : null;

  if (!storage) {
    return;
  }

  const stored = storage.getItem("user");
  if (!stored) {
    return;
  }

  try {
    const user = JSON.parse(stored) as AuthenticatedUser;
    user.fullName = fullName;
    storage.setItem("user", JSON.stringify(user));
    window.dispatchEvent(new CustomEvent("authUserUpdated"));
  } catch {
    // ignore invalid storage
  }
}
