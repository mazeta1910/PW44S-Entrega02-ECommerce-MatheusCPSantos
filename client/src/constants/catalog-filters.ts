import type { DeliveryType, ItemCondition, Platform } from "@/commons/types";

export interface CatalogFilterOption<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

export const CATALOG_DELIVERY_FILTERS: CatalogFilterOption<DeliveryType>[] = [
  {
    value: "PHYSICAL",
    label: "Entrega física",
    hint: "Hardware, periféricos, monitores enviados",
  },
  {
    value: "DIGITAL",
    label: "Entrega digital",
    hint: "Chaves e créditos para download",
  },
];

export const CATALOG_PLATFORM_FILTERS: CatalogFilterOption<Platform>[] = [
  { value: "STEAM", label: "PC — Steam" },
  { value: "EPIC", label: "PC — Epic Games" },
  { value: "PS5", label: "PlayStation" },
  { value: "XBOX_SERIES", label: "Xbox Series" },
  { value: "UNIVERSAL", label: "Sem plataforma específica" },
];

export const CATALOG_CONDITION_FILTERS: CatalogFilterOption<ItemCondition>[] = [
  { value: "NEW", label: "Novo", hint: "Lacrado ou chave inédita" },
  { value: "SEMI_NEW", label: "Semi-novo", hint: "Pouco uso, revenda verificada" },
  { value: "USED", label: "Usado", hint: "Revenda entre jogadores" },
];

export function getDeliveryLabel(value: DeliveryType): string {
  return (
    CATALOG_DELIVERY_FILTERS.find((item) => item.value === value)?.label ?? value
  );
}

export function getPlatformLabel(value: Platform): string {
  return (
    CATALOG_PLATFORM_FILTERS.find((item) => item.value === value)?.label ?? value
  );
}

export function getConditionLabel(value: ItemCondition): string {
  return (
    CATALOG_CONDITION_FILTERS.find((item) => item.value === value)?.label ?? value
  );
}
