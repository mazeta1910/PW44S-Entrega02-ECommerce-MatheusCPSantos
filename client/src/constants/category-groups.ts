import type { ICategory } from "@/commons/types";

export interface CategoryGroupDefinition {
  id: string;
  label: string;
  iconClass: string;
  categoryNames: string[];
}

export const CATEGORY_GROUP_DEFINITIONS: CategoryGroupDefinition[] = [
  {
    id: "games",
    label: "Jogos e mídia",
    iconClass: "pi pi-play",
    categoryNames: [
      "Jogos",
      "Consoles",
      "Gift Cards e Assinaturas",
      "Realidade Virtual",
    ],
  },
  {
    id: "hardware",
    label: "Hardware e PC",
    iconClass: "pi pi-microchip",
    categoryNames: [
      "Periféricos",
      "PC e Hardware",
      "Monitores",
      "Computadores",
      "Notebooks Gamer",
      "Notebook Gamer",
      "Tablets e Handhelds",
    ],
  },
  {
    id: "setup",
    label: "Setup e conforto",
    iconClass: "pi pi-home",
    categoryNames: ["Cadeiras", "Mesa e Setup", "Espaço Gamer"],
  },
  {
    id: "audio-video",
    label: "Áudio e vídeo",
    iconClass: "pi pi-volume-up",
    categoryNames: ["Áudio e Streaming", "TV Gamer", "Projetores"],
  },
  {
    id: "mobile-connectivity",
    label: "Mobile e conectividade",
    iconClass: "pi pi-mobile",
    categoryNames: [
      "Celular e Smartphone",
      "Serviços e Conectividade",
      "Energia",
      "Casa Inteligente",
    ],
  },
  {
    id: "accessories",
    label: "Acessórios e colecionáveis",
    iconClass: "pi pi-star",
    categoryNames: ["Acessórios e Cabos", "Geek e Colecionáveis"],
  },
];

const OTHER_GROUP_ID = "other";

export interface ResolvedCategoryGroup {
  id: string;
  label: string;
  iconClass: string;
  categories: ICategory[];
}

export function groupCategories(categories: ICategory[]): ResolvedCategoryGroup[] {
  const assigned = new Set<number>();
  const groups: ResolvedCategoryGroup[] = [];

  for (const definition of CATEGORY_GROUP_DEFINITIONS) {
    const matched = categories.filter((category) => {
      if (category.id == null || !category.name) {
        return false;
      }
      if (!definition.categoryNames.includes(category.name)) {
        return false;
      }
      assigned.add(category.id);
      return true;
    });

    if (matched.length > 0) {
      groups.push({
        id: definition.id,
        label: definition.label,
        iconClass: definition.iconClass,
        categories: matched.sort((a, b) => a.name.localeCompare(b.name, "pt-BR")),
      });
    }
  }

  const others = categories
    .filter((category) => category.id != null && !assigned.has(category.id))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  if (others.length > 0) {
    groups.push({
      id: OTHER_GROUP_ID,
      label: "Outros departamentos",
      iconClass: "pi pi-tags",
      categories: others,
    });
  }

  return groups;
}
