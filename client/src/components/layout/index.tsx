import { Outlet } from "react-router-dom";
import { ConfirmDialog } from "primereact/confirmdialog";
import { ScrollToTop } from "@/components/scroll-to-top";
import TopMenu from "@/components/top-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { SupportChatWidget } from "@/components/support-chat-widget";
import { AppToast } from "@/components/app-toast";
import { CookieConsent } from "@/components/cookie-consent";
import "./styles.css";

export function Layout() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <ConfirmDialog />
      <AppToast />
      <CookieConsent />
      <TopMenu />
      <div className="app-floating-actions" aria-label="Ações rápidas">
        <ThemeToggle />
      </div>
      <SupportChatWidget />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
