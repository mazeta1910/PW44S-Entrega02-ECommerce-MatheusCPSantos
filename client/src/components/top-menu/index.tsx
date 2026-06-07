import React, { useEffect, useMemo, useState } from "react";
import { Menubar } from "primereact/menubar";
import type { MenuItem } from "primereact/menuitem";
import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import { isAdmin, getUserAvatarUrl } from "@/utils/auth-utils";
import { InputSwitch } from "primereact/inputswitch";
import { StoreCategoriesMenu } from "@/components/store-categories-menu";
import { Badge } from "primereact/badge";
import { getCartItemCount } from "@/utils/cart-storage";
import "./styles.css";

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("theme") === "dark";
  });
  const [cartCount, setCartCount] = useState(0);
  const { authenticated, authenticatedUser, handleLogout } = useAuth();

  const displayName =
    authenticatedUser?.displayName ?? authenticatedUser?.username ?? "Usuário";
  const avatarUrl = getUserAvatarUrl(authenticatedUser);

  useEffect(() => {
    const themeLink = document.getElementById("theme-link") as HTMLLinkElement;
    themeLink.href = darkMode
      ? "https://unpkg.com/primereact/resources/themes/lara-dark-blue/theme.css"
      : "https://unpkg.com/primereact/resources/themes/lara-light-blue/theme.css";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  useEffect(() => {
    const updateCartCount = () => {
      setCartCount(getCartItemCount());
    };

    updateCartCount();

    window.addEventListener("cartUpdated", updateCartCount);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

  const adminMenuItems = useMemo<MenuItem[]>(() => {
    if (!authenticated || !isAdmin(authenticatedUser)) {
      return [];
    }

    return [
      {
        label: "Painel admin",
        icon: "pi pi-th-large",
        command: () => navigate("/admin"),
      },
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
  }, [authenticated, authenticatedUser, navigate]);

  const handleLogoClick = () => {
    if (authenticated && isAdmin(authenticatedUser)) {
      navigate("/admin");
      return;
    }
    navigate("/");
  };

  const start = (
    <div className="top-menu-start">
      <div
        className="top-menu-brand flex align-items-center gap-2 cursor-pointer"
        onClick={handleLogoClick}
      >
        <img
          src="/Logo.png"
          alt="Logo"
          height={40}
          style={{ objectFit: "contain" }}
        />
      </div>

      <nav className="top-menu-store-nav" aria-label="Navegação da loja">
        <button
          type="button"
          className="top-menu-nav-link"
          onClick={() => navigate("/")}
        >
          <span className="pi pi-home top-menu-nav-icon" aria-hidden />
          <span>Início</span>
        </button>
        <StoreCategoriesMenu />
      </nav>
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
          {avatarUrl ? (
            <Avatar
              image={avatarUrl}
              shape="circle"
              className="top-menu-user-avatar"
              aria-label={`Foto de perfil de ${displayName}`}
            />
          ) : (
            <Avatar
              label={displayName.charAt(0).toUpperCase()}
              shape="circle"
              className="bg-primary"
              aria-label={`Avatar de ${displayName}`}
            />
          )}
          <div className="cart-button-wrapper">
            <Button
              icon="pi pi-shopping-cart"
              className="p-button-text"
              onClick={() => navigate("/cart")}
              tooltip="Meu Carrinho"
            />

            {cartCount > 0 && (
              <Badge
                value={cartCount}
                severity="danger"
                className="cart-badge-prime"
              />
            )}
          </div>
          
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
      className="fixed top-0 left-0 w-full z-50 top-menu-shell"
    >
      <Menubar
        key={authenticated ? "auth" : "guest"}
        model={adminMenuItems}
        start={start}
        end={end}
      />
    </div>
  );
};

export default TopMenu;
