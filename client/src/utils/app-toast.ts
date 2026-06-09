export interface AppToastPayload {
  severity?: "success" | "info" | "warn" | "error";
  summary: string;
  detail?: string;
  life?: number;
}

export const APP_TOAST_EVENT = "app-toast";

export function showAppToast(payload: AppToastPayload) {
  window.dispatchEvent(new CustomEvent(APP_TOAST_EVENT, { detail: payload }));
}
