import type { AuthenticatedUser } from "@/commons/types";

function parseStoredToken(raw: string): string {
  try {
    return raw.startsWith('"') ? JSON.parse(raw) : raw;
  } catch {
    return raw;
  }
}

export function clearAuthData(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
}

export function persistAuthData(
  token: string,
  user: AuthenticatedUser,
  rememberMe = true,
): void {
  clearAuthData();

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem("token", token);
  storage.setItem("user", JSON.stringify(user));
}

export function getStoredToken(): string | null {
  const raw =
    localStorage.getItem("token") ?? sessionStorage.getItem("token");
  return raw ? parseStoredToken(raw) : null;
}

export function getStoredUser(): AuthenticatedUser | null {
  const raw = localStorage.getItem("user") ?? sessionStorage.getItem("user");
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthenticatedUser;
  } catch {
    return null;
  }
}
