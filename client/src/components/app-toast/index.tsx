import { useEffect, useRef } from "react";
import { Toast } from "primereact/toast";
import { APP_TOAST_EVENT, type AppToastPayload } from "@/utils/app-toast";

export function AppToast() {
  const toast = useRef<Toast>(null);

  useEffect(() => {
    const handleToast = (event: Event) => {
      const { detail } = event as CustomEvent<AppToastPayload>;

      toast.current?.show({
        severity: detail.severity ?? "info",
        summary: detail.summary,
        detail: detail.detail,
        life: detail.life ?? 4000,
      });
    };

    window.addEventListener(APP_TOAST_EVENT, handleToast);
    return () => window.removeEventListener(APP_TOAST_EVENT, handleToast);
  }, []);

  return <Toast ref={toast} position="top-right" />;
}
