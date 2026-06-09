import { Outlet } from "react-router-dom";
import { ConfirmDialog } from "primereact/confirmdialog";
import TopMenu from "@/components/top-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppToast } from "@/components/app-toast";
import { CookieConsent } from "@/components/cookie-consent";
import "./styles.css";

export function Layout() {
  return (
    <div className="app-shell">
      <ConfirmDialog />
      <AppToast />
      <CookieConsent />
      <TopMenu />
      <ThemeToggle />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
