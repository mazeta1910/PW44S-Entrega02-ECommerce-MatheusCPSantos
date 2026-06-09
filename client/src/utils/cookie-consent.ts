export const COOKIE_CONSENT_STORAGE_KEY = "nexus_cookie_consent";
export const COOKIE_CONSENT_DISMISSED_SESSION_KEY = "nexus_cookie_consent_dismissed";

export function shouldShowCookieConsent(): boolean {
  try {
    if (localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY) === "accepted") {
      return false;
    }

    if (sessionStorage.getItem(COOKIE_CONSENT_DISMISSED_SESSION_KEY) === "true") {
      return false;
    }

    return true;
  } catch {
    return true;
  }
}

export function acceptCookieConsent(): void {
  try {
    localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, "accepted");
    sessionStorage.removeItem(COOKIE_CONSENT_DISMISSED_SESSION_KEY);
  } catch {
    // Ignora falhas de armazenamento local (modo privado, quota, etc.).
  }
}

export function dismissCookieConsentForSession(): void {
  try {
    sessionStorage.setItem(COOKIE_CONSENT_DISMISSED_SESSION_KEY, "true");
  } catch {
    // Ignora falhas de armazenamento em sessão.
  }
}
