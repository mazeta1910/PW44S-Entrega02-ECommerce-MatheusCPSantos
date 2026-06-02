import { useNavigate } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useAuth } from "@/context/hooks/use-auth";
import "./styles.css";

interface AdminAction {
  title: string;
  description: string;
  icon: string;
  path: string;
}

const ADMIN_ACTIONS: AdminAction[] = [
  {
    title: "Categorias",
    description: "Listar, criar e editar departamentos da loja.",
    icon: "pi pi-tags",
    path: "/categories",
  },
  {
    title: "Produtos",
    description: "Gerenciar catálogo, variações e ofertas.",
    icon: "pi pi-box",
    path: "/products",
  },
  {
    title: "Novo produto",
    description: "Cadastrar um item no catálogo.",
    icon: "pi pi-plus-circle",
    path: "/products/new",
  },
  {
    title: "Ver loja",
    description: "Abrir a vitrine pública como cliente.",
    icon: "pi pi-shopping-bag",
    path: "/catalog",
  },
];

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const { authenticatedUser } = useAuth();

  const displayName =
    authenticatedUser?.displayName ??
    authenticatedUser?.username ??
    "Administrador";

  return (
    <div className="admin-dashboard page-container">
      <header className="admin-dashboard-header">
        <div>
          <p className="admin-dashboard-eyebrow">Painel administrativo</p>
          <h1>Olá, {displayName}</h1>
          <p className="admin-dashboard-subtitle">
            Central de gestão da Nexus Store. Use os atalhos abaixo para manter
            categorias e produtos; em breve você poderá acompanhar pedidos e
            cupons por aqui.
          </p>
        </div>
        <Button
          type="button"
          label="Ir para a loja"
          icon="pi pi-external-link"
          className="p-button-outlined"
          onClick={() => navigate("/")}
        />
      </header>

      <section className="admin-dashboard-grid" aria-label="Atalhos rápidos">
        {ADMIN_ACTIONS.map((action) => (
          <Card key={action.path} className="admin-dashboard-card shadow-2">
            <div className="admin-dashboard-card-body">
              <span className="admin-dashboard-card-icon" aria-hidden>
                <i className={action.icon} />
              </span>
              <h2>{action.title}</h2>
              <p>{action.description}</p>
              <Button
                type="button"
                label="Abrir"
                icon="pi pi-arrow-right"
                iconPos="right"
                className="p-button-sm"
                onClick={() => navigate(action.path)}
              />
            </div>
          </Card>
        ))}
      </section>

      <section className="admin-dashboard-note">
        <i className="pi pi-info-circle" aria-hidden />
        <p>
          Esta área é exclusiva para administradores. Alterações feitas aqui
          refletem no catálogo público após salvar no servidor.
        </p>
      </section>
    </div>
  );
}
