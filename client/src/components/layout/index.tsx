import { Outlet } from "react-router-dom";
import TopMenu from "@/components/top-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { AppToast } from "@/components/app-toast";
import "./styles.css";

export function Layout() {
  return (
    <div className="app-shell">
      <AppToast />
      <TopMenu />
      <ThemeToggle />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
