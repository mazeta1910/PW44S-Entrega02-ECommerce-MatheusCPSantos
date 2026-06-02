import React, { useEffect, useMemo, useState } from "react";
import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import { InputSwitch } from "primereact/inputswitch";

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const { authenticated, authenticatedUser, handleLogout } = useAuth();

  const displayName =
    authenticatedUser?.displayName ?? authenticatedUser?.username ?? "Usuário";

  useEffect(() => {
    const themeLink = document.getElementById("theme-link") as HTMLLinkElement;
    themeLink.href = darkMode
      ? "https://unpkg.com/primereact/resources/themes/lara-dark-blue/theme.css"
      : "https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const goToCatalog = () => {
    navigate("/catalog");
  };

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

  const menuItems = useMemo<MenuItem[]>(() => {
    const storeItems: MenuItem[] = [
      { label: "Início", icon: "pi pi-home", command: () => navigate("/") },
      {
        label: "Produtos",
        icon: "pi pi-shopping-bag",
        command: goToCatalog,
      },
    ];

    if (!authenticated) {
      return storeItems;
    }

    return [
      ...storeItems,
      {
        label: "Administração",
        icon: "pi pi-cog",
        items: [
          {
            label: "Categorias",
            icon: "pi pi-tags",
            items: [
              {
                label: "Listar",
                icon: "pi pi-list",
                command: () => navigate("/categories"),
              },
              {
                label: "Nova categoria",
                icon: "pi pi-plus",
                command: () => navigate("/categories/new"),
              },
            ],
          },
          {
            label: "Produtos",
            icon: "pi pi-box",
            items: [
              {
                label: "Listar",
                icon: "pi pi-list",
                command: () => navigate("/products"),
              },
              {
                label: "Novo produto",
                icon: "pi pi-plus",
                command: () => navigate("/products/new"),
              },
            ],
          },
        ],
      },
    ];
  }, [authenticated, navigate, location.pathname]);

  const handleLogoClick = () => {
    navigate("/");
  };

  const start = (
    <div
      className="flex align-items-center gap-2 cursor-pointer"
      onClick={handleLogoClick}
    >
      <img
        src="/assets/images/utfpr-logo-nb.png"
        alt="Logo"
        height={32}
        style={{ objectFit: "contain" }}
      />
      <span className="font-bold text-lg hidden sm:block">Nexus Store</span>
    </div>
  );

  const end = (
    <div className="flex align-items-center gap-3">
      <div className="flex items-center gap-2">
        <i
          className={`pi pi-sun ${
            darkMode ? "text-gray-400" : "text-yellow-500"
          }`}
          style={{ marginTop: "5px" }}
        />
        <InputSwitch
          checked={darkMode}
          onChange={(e) => setDarkMode(e.value ?? false)}
        />
        <i
          className={`pi pi-moon ${
            darkMode ? "text-blue-300" : "text-gray-400"
          }`}
          style={{ marginTop: "5px" }}
        />
      </div>

      {authenticated ? (
        <>
          <span className="font-semibold hidden sm:block">{displayName}</span>
          <Avatar
            label={displayName.charAt(0).toUpperCase()}
            shape="circle"
            className="bg-primary"
          />
          <Button
            icon="pi pi-sign-out"
            className="p-button-text"
            onClick={handleLogoutClick}
            tooltip="Sair"
          />
        </>
      ) : (
        <>
          {location.pathname !== "/login" && (
            <Button
              label="Entrar"
              icon="pi pi-sign-in"
              className="p-button-text"
              onClick={() => navigate("/login")}
            />
          )}
          {location.pathname !== "/register" && (
            <Button
              label="Criar conta"
              icon="pi pi-user-plus"
              className="p-button-outlined"
              onClick={() => navigate("/register")}
            />
          )}
        </>
      )}
    </div>
  );

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1000,
        backgroundColor: "var(--surface-ground)",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      }}
      className="fixed top-0 left-0 w-full z-50"
    >
      <Menubar
        key={authenticated ? "auth" : "guest"}
        model={menuItems}
        start={start}
        end={end}
      />
    </div>
  );
};

export default TopMenu;
