import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";
import type { MenuItem } from "primereact/menuitem";
import "./styles.css";

interface StoreBreadcrumbProps {
  /** Segmentos após "Catálogo" (ex.: nomes de categorias filtradas). */
  trail?: string[];
}

export function StoreBreadcrumb({ trail = [] }: StoreBreadcrumbProps) {
  const navigate = useNavigate();

  const home: MenuItem = {
    icon: "pi pi-home",
    label: "Início",
    command: () => navigate("/"),
  };

  const model = useMemo<MenuItem[]>(() => {
    const items: MenuItem[] = [
      {
        label: "Catálogo",
        command: () => navigate("/catalog"),
      },
    ];

    trail.forEach((label, index) => {
      const isLast = index === trail.length - 1;
      items.push(
        isLast
          ? { label }
          : {
              label,
              command: () => navigate("/catalog"),
            },
      );
    });

    return items;
  }, [trail, navigate]);

  return (
    <nav className="store-breadcrumb" aria-label="Navegação estrutural">
      <BreadCrumb home={home} model={model} />
    </nav>
  );
}
