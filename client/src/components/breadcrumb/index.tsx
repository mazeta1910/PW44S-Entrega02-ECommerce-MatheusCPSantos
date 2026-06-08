import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { BreadCrumb } from "primereact/breadcrumb";
import type { MenuItem } from "primereact/menuitem";
import "./styles.css";

export interface BreadcrumbSegment {
  label: string;
  /** Rota ao clicar; omitir no item atual (último). */
  to?: string;
}

export interface PageBreadcrumbProps {
  /** Segmentos após "Catálogo" (quando incluído). O último é a página atual. */
  segments?: BreadcrumbSegment[];
  /** Exibe o link "Catálogo" entre Início e os segmentos. Padrão: true. */
  includeCatalog?: boolean;
}

export function PageBreadcrumb({
  segments = [],
  includeCatalog = true,
}: PageBreadcrumbProps) {
  const navigate = useNavigate();

  const home: MenuItem = {
    icon: "pi pi-home",
    label: "Início",
    command: () => navigate("/"),
  };

  const model = useMemo<MenuItem[]>(() => {
    const parts: BreadcrumbSegment[] = [
      ...(includeCatalog ? [{ label: "Catálogo", to: "/catalog" }] : []),
      ...segments,
    ];

    if (parts.length === 0) {
      return [];
    }

    return parts.map((part, index) => {
      const isLast = index === parts.length - 1;

      if (isLast) {
        return { label: part.label };
      }

      const path = part.to ?? (includeCatalog ? "/catalog" : "/");

      return {
        label: part.label,
        command: () => navigate(path),
      };
    });
  }, [segments, includeCatalog, navigate]);

  return (
    <nav className="page-breadcrumb" aria-label="Navegação estrutural">
      <BreadCrumb home={home} model={model} />
    </nav>
  );
}

/** @deprecated Use PageBreadcrumb */
export function StoreBreadcrumb({
  trail = [],
}: {
  trail?: string[];
}) {
  return (
    <PageBreadcrumb
      segments={trail.map((label) => ({ label }))}
      includeCatalog
    />
  );
}
