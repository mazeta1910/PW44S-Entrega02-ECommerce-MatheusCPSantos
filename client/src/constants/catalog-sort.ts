export type CatalogSort =
  | "RELEVANCE"
  | "PRICE_ASC"
  | "PRICE_DESC"
  | "RATING_DESC"
  | "POPULARITY_DESC"
  | "DISCOUNT_DESC"
  | "NAME_ASC"
  | "NAME_DESC";

export interface CatalogSortOption {
  value: CatalogSort;
  label: string;
  hint?: string;
}

export const CATALOG_SORT_OPTIONS: CatalogSortOption[] = [
  { value: "RELEVANCE", label: "Relevância", hint: "Mais recentes primeiro" },
  { value: "PRICE_ASC", label: "Menor preço" },
  { value: "PRICE_DESC", label: "Maior preço" },
  { value: "RATING_DESC", label: "Mais avaliados" },
  { value: "POPULARITY_DESC", label: "Mais populares", hint: "Com mais avaliações" },
  { value: "DISCOUNT_DESC", label: "Maior desconto" },
  { value: "NAME_ASC", label: "Nome (A → Z)" },
  { value: "NAME_DESC", label: "Nome (Z → A)" },
];

export const DEFAULT_CATALOG_SORT: CatalogSort = "RELEVANCE";

export function parseCatalogSort(value: string | null): CatalogSort {
  if (!value) {
    return DEFAULT_CATALOG_SORT;
  }

  const match = CATALOG_SORT_OPTIONS.find((option) => option.value === value);
  return match?.value ?? DEFAULT_CATALOG_SORT;
}

export function getCatalogSortLabel(value: CatalogSort): string {
  return (
    CATALOG_SORT_OPTIONS.find((option) => option.value === value)?.label ?? value
  );
}
