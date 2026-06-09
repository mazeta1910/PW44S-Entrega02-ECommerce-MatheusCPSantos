import React, { useEffect, useMemo, useRef, useState } from "react";
import type { MenuItem } from "primereact/menuitem";
import { Button } from "primereact/button";
import { TieredMenu } from "primereact/tieredmenu";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/hooks/use-auth";
import { isAdmin, getUserDisplayName } from "@/utils/auth-utils";
import { performLogout } from "@/utils/logout-utils";
import { StoreCategoriesMenu } from "@/components/store-categories-menu";
import { ProductSearchBar } from "@/components/product-search-bar";
import { UserAccountMenu } from "@/components/user-account-menu";
import { LoginPopover } from "@/components/login-popover";
import { Badge } from "primereact/badge";
import { getCartItemCount } from "@/utils/cart-storage";
import "./styles.css";

const TopMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const adminMenuRef = useRef<TieredMenu>(null);
  const [cartCount, setCartCount] = useState(0);
  const { authenticated, authenticatedUser, handleLogout } = useAuth();

  const userLabel = getUserDisplayName(authenticatedUser);

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
    performLogout(handleLogout, navigate);
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

  const cartButton = (
    <div className="cart-button-wrapper">
      <Button
        icon="pi pi-shopping-cart"
        className="p-button-text top-menu-cart-btn"
        onClick={() => navigate("/cart")}
        tooltip="Meu Carrinho"
        tooltipOptions={{
          position: "bottom",
          appendTo: typeof document !== "undefined" ? document.body : undefined,
          className: "top-menu-cart-tooltip",
        }}
      />
      {cartCount > 0 && (
        <Badge value={cartCount} className="cart-badge-prime" />
      )}
    </div>
  );

  return (
    <header className="top-menu-shell">
      <div className="top-menu-bar">
        <div className="top-menu-bar__left">
          <button
            type="button"
            className="top-menu-brand"
            onClick={handleLogoClick}
            aria-label="Ir para a página inicial"
          >
            <img
              src="/Logo.png"
              alt="NEXUS Store"
              className="top-menu-brand__logo"
            />
          </button>

          <nav className="top-menu-store-nav" aria-label="Navegação da loja">
            <button
              type="button"
              className="top-menu-nav-link"
              onClick={() => navigate("/")}
            >
              <span className="pi pi-home top-menu-nav-icon" aria-hidden />
              <span>Início</span>
            </button>
            <Link to="/catalog" className="top-menu-nav-link">
              <span className="pi pi-th-large top-menu-nav-icon" aria-hidden />
              <span>Catálogo</span>
            </Link>
            <Link to="/catalog?onSale=true" className="top-menu-nav-link">
              <span className="pi pi-percentage top-menu-nav-icon" aria-hidden />
              <span>Promoções</span>
            </Link>
            <StoreCategoriesMenu />
          </nav>
        </div>

        <div className="top-menu-bar__search">
          <ProductSearchBar />
        </div>

        <div className="top-menu-bar__actions">
          {authenticated && isAdmin(authenticatedUser) && (
            <>
              <Button
                type="button"
                label="Admin"
                icon="pi pi-cog"
                className="p-button-text top-menu-admin-btn"
                onClick={(event) => adminMenuRef.current?.toggle(event)}
                aria-haspopup
                aria-controls="top-menu-admin-menu"
              />
              <TieredMenu
                id="top-menu-admin-menu"
                model={adminMenuItems}
                popup
                ref={adminMenuRef}
              />
            </>
          )}

          {cartButton}

          {authenticated ? (
            <>
              <UserAccountMenu
                userLabel={userLabel}
                authenticatedUser={authenticatedUser}
              />
              <Button
                icon="pi pi-sign-out"
                className="p-button-text top-menu-logout-btn"
                onClick={handleLogoutClick}
                aria-label="Sair"
                tooltip="Sair"
                tooltipOptions={{
                  position: "bottom",
                  appendTo: typeof document !== "undefined" ? document.body : undefined,
                  className: "top-menu-logout-tooltip",
                }}
              />
            </>
          ) : (
            <>
              {location.pathname !== "/login" && <LoginPopover />}
              {location.pathname !== "/register" && (
                <Button
                  label="Criar conta"
                  icon="pi pi-user-plus"
                  className="p-button-outlined top-menu-register-btn"
                  onClick={() => navigate("/register")}
                />
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopMenu;
