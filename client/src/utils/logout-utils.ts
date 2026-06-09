import type { NavigateFunction } from "react-router-dom";
import { showAppToast } from "@/utils/app-toast";

export function performLogout(
  handleLogout: () => void,
  navigate: NavigateFunction,
) {
  handleLogout();
  showAppToast({
    severity: "info",
    summary: "Até logo!",
    detail: "Você saiu da sua conta com sucesso.",
    life: 4500,
  });
  navigate("/");
}
