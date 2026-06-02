import { Outlet } from "react-router-dom";
import TopMenu from "@/components/top-menu";
import "./styles.css";

export function Layout() {
  return (
    <div className="app-shell">
      <TopMenu />
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
