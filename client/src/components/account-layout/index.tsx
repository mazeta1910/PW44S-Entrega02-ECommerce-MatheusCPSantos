import { useMemo, useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { confirmDialog } from "primereact/confirmdialog";
import { useAuth } from "@/context/hooks/use-auth";
import { PageBreadcrumb } from "@/components/breadcrumb";
import {
  getUserAvatarUrl,
  getUserDisplayName,
  getUserInitial,
  USER_AVATAR_UPDATED_EVENT,
} from "@/utils/auth-utils";
import { performLogout } from "@/utils/logout-utils";
import { splitFullName } from "@/utils/user-utils";
import Footer from "@/components/footer";
import "./styles.css";

const NAV_ITEMS = [
  {
    to: "/account",
    end: true,
    title: "Meus dados",
    description: "Visualizar e editar seus dados pessoais",
  },
  {
    to: "/account/addresses",
    end: false,
    title: "Endereços",
    description: "Gerenciar endereços de entrega",
  },
  {
    to: "/account/orders",
    end: false,
    title: "Pedidos",
    description: "Acompanhar compras e detalhes",
  },
] as const;

export function AccountLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authenticatedUser, handleLogout } = useAuth();
  const [avatarVersion, setAvatarVersion] = useState(0);

  useEffect(() => {
    const refreshAvatar = () => setAvatarVersion((value) => value + 1);
    window.addEventListener(USER_AVATAR_UPDATED_EVENT, refreshAvatar);
    return () =>
      window.removeEventListener(USER_AVATAR_UPDATED_EVENT, refreshAvatar);
  }, []);

  const userLabel = getUserDisplayName(authenticatedUser);
  const firstName = splitFullName(userLabel).firstName || userLabel;
  const avatarUrl = getUserAvatarUrl(authenticatedUser);

  const breadcrumbSegments = useMemo(() => {
    if (location.pathname.endsWith("/orders")) {
      return [
        { label: "Minha conta", to: "/account" },
        { label: "Pedidos" },
      ];
    }

    if (location.pathname.endsWith("/addresses")) {
      return [
        { label: "Minha conta", to: "/account" },
        { label: "Endereços" },
      ];
    }

    return [{ label: "Minha conta" }];
  }, [location.pathname]);

  const handleLogoutClick = () => {
    performLogout(handleLogout, navigate);
  };

  return (
    <div className="account-page page-container">
      <div className="account-page__container">
        <PageBreadcrumb segments={breadcrumbSegments} includeCatalog={false} />

        <header className="account-page__header">
          {avatarUrl ? (
            <Avatar
              key={avatarVersion}
              image={avatarUrl}
              shape="circle"
              className="account-page__header-avatar"
              aria-hidden
            />
          ) : (
            <Avatar
              label={getUserInitial(authenticatedUser)}
              shape="circle"
              className="account-page__header-avatar bg-primary"
              aria-hidden
            />
          )}
          <h1 className="account-page__header-greeting">Olá, {firstName}!</h1>
        </header>

        <div className="account-page__layout">
          <aside className="account-page__sidebar" aria-label="Menu da conta">
            <nav className="account-page__nav">
              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `account-page__nav-item${isActive ? " account-page__nav-item--active" : ""}`
                  }
                >
                  <span className="account-page__nav-title">{item.title}</span>
                  <span className="account-page__nav-description">
                    {item.description}
                  </span>
                </NavLink>
              ))}

              <button
                type="button"
                className="account-page__nav-item account-page__nav-item--logout"
                onClick={() =>
                  confirmDialog({
                    message: "Tem certeza de que deseja sair da sua conta?",
                    header: "Confirmar saída",
                    icon: "pi pi-exclamation-triangle",
                    acceptLabel: "Sair",
                    rejectLabel: "Cancelar",
                    acceptClassName: "p-button-danger",
                    accept: handleLogoutClick,
                  })
                }
              >
                <span className="account-page__nav-title">Sair</span>
                <span className="account-page__nav-description">
                  Encerrar sessão com segurança
                </span>
              </button>
            </nav>
          </aside>

          <main className="account-page__content">
            <Outlet
              context={{
                userLabel,
                onAvatarUpdated: () => setAvatarVersion((value) => value + 1),
              }}
            />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
