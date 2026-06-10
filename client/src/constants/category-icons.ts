/** Classes PrimeIcons (pi pi-*) — já usadas no projeto via PrimeReact */
const CATEGORY_ICON_CLASSES: Record<string, string> = {
  Periféricos: "pi pi-box",
  Jogos: "pi pi-play",
  "PC e Hardware": "pi pi-microchip",
  Monitores: "pi pi-window-maximize",
  Cadeiras: "pi pi-user",
  Consoles: "pi pi-play-circle",
  "Serviços e Conectividade": "pi pi-wifi",
  "Notebooks Gamer": "pi pi-gauge",
  "Notebook Gamer": "pi pi-gauge",
  "Áudio e Streaming": "pi pi-volume-up",
  "Realidade Virtual": "pi pi-eye",
  "Mesa e Setup": "pi pi-table",
  "Acessórios e Cabos": "pi pi-link",
  Computadores: "pi pi-desktop",
  "Celular e Smartphone": "pi pi-mobile",
  "TV Gamer": "pi pi-video",
  "Gift Cards e Assinaturas": "pi pi-gift",
  "Tablets e Handhelds": "pi pi-tablet",
  "Espaço Gamer": "pi pi-home",
  Energia: "pi pi-bolt",
  "Geek e Colecionáveis": "pi pi-star",
  "Casa Inteligente": "pi pi-lightbulb",
  Projetores: "pi pi-images",
};

const DEFAULT_ICON_CLASS = "pi pi-tag";

export function getCategoryIconClass(name: string): string {
  return CATEGORY_ICON_CLASSES[name] ?? DEFAULT_ICON_CLASS;
}
