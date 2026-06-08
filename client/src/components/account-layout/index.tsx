import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import { useAuth } from "@/context/hooks/use-auth";
import {
  getUserAvatarUrl,
  getUserDisplayName,
  getUserInitial,
} from "@/utils/auth-utils";
import Footer from "@/components/footer";
import "./styles.css";

const NAV_ITEMS = [
  {
    to: "/account",
    end: true,
    title: "cadastro",
    description: "ver e alterar seus dados e seu e-mail",
    icon: "pi pi-user",
  },
  {
    to: "/account/addresses",
    end: false,
    title: "endereços",
    description: "ver e alterar seus endereços",
    icon: "pi pi-map-marker",
  },
  {
    to: "/account/orders",
    end: false,
    title: "pedidos",
    description: "acompanhar envio e ver detalhes",
    icon: "pi pi-shopping-bag",
  },
] as const;

export function AccountLayout() {
  const navigate = useNavigate();
  const { authenticatedUser, handleLogout } = useAuth();
  const userLabel = getUserDisplayName(authenticatedUser);
  const avatarUrl = getUserAvatarUrl(authenticatedUser);

  const handleLogoutClick = () => {
    handleLogout();
    navigate("/");
  };

  return (
    <div className="account-page">
      <div className="account-page__container">
        <header className="account-page__header">
          {avatarUrl ? (
            <Avatar
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
          <p className="account-page__header-greeting">
            olá, aqui é a sua conta :)
          </p>
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
                onClick={handleLogoutClick}
              >
                <span className="account-page__nav-title">sair</span>
                <span className="account-page__nav-description">
                  deslogar da conta e encerrar sessão
                </span>
              </button>
            </nav>
          </aside>

          <main className="account-page__content">
            <Outlet context={{ userLabel }} />
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
}
