import type { DeliveryType, IProductVariant, Platform } from "@/commons/types";
import {
  getConditionLabel,
  getDeliveryLabel,
  getPlatformLabel,
} from "@/constants/catalog-filters";
import { formatCurrency } from "@/utils/product-utils";

export const COMPACT_VARIANT_THRESHOLD = 3;

//interface para agrupar as variantes
export interface VariantGroup {
  key: string;
  title: string;
  variants: IProductVariant[];
}

//função para obter a chave da variante
export function getVariantKey(variant: IProductVariant): string {
  return String(variant.id ?? variant.sku);
}

//função para verificar se a variante está em estoque
export function isVariantInStock(variant: IProductVariant): boolean {
  if (variant.active === false) {
    return false;
  }

  const stock = variant.stockQuantity;
  return stock == null || stock > 0;
}

//função para obter a melhor variante padrão
export function getBestDefaultVariant(
  variants: IProductVariant[],
): IProductVariant | null {
  const available = variants.filter(isVariantInStock);

  if (available.length === 0) {
    return variants[0] ?? null;
  }

  //ordena as variantes por preço e promoção
  return [...available].sort((left, right) => {
    const priceLeft = Number(left.price);
    const priceRight = Number(right.price);
    const promoLeft =
      left.listPrice != null && Number(left.listPrice) > priceLeft;
    const promoRight =
      right.listPrice != null && Number(right.listPrice) > priceRight;

    if (promoLeft !== promoRight) {
      return promoLeft ? -1 : 1;
    }

    return priceLeft - priceRight;
  })[0];
}

//função para agrupar as variantes por plataforma
function groupByPlatform(
  variants: IProductVariant[],
  prefix: string,
  deliveryLabel: string,
): VariantGroup[] {
  const map = new Map<Platform, IProductVariant[]>();

  variants.forEach((variant) => {
    const current = map.get(variant.platform) ?? [];
    current.push(variant);
    map.set(variant.platform, current);
  });

  return [...map.entries()].map(([platform, items]) => ({
    key: `${prefix}-${platform}`,
    title: `${deliveryLabel} · ${getPlatformLabel(platform)}`,
    variants: items,
  }));
}

//função para agrupar as variantes por plataforma
export function groupProductVariants(
  variants: IProductVariant[],
): VariantGroup[] {
  const digital = variants.filter(
    (variant) => variant.deliveryType === "DIGITAL",
  );
  const physical = variants.filter(
    (variant) => variant.deliveryType === "PHYSICAL",
  );

  return [
    ...groupByPlatform(digital, "digital", "Digital"),
    ...groupByPlatform(physical, "physical", "Físico"),
  ];
}

//função para construir a informação de entrega das variantes
export function buildDeliveryInfo(variants: IProductVariant[]): string {
  const deliveryTypes = new Set<DeliveryType>(
    variants.map((variant) => variant.deliveryType),
  );

  const lines: string[] = [];

  if (deliveryTypes.has("DIGITAL")) {
    lines.push(
      "Entrega digital: após a confirmação do pagamento, a chave ou o acesso é enviado por e-mail em até 30 minutos.",
    );
  }

  if (deliveryTypes.has("PHYSICAL")) {
    lines.push(
      "Entrega física: prazo estimado de 3 a 10 dias úteis após a postagem, conforme CEP e transportadora.",
    );
    lines.push(
      "Produtos usados ou semi-novos passam por verificação antes do envio.",
    );
  }

  return lines.join("\n\n");
}

//função para formatar a meta da variante
export function formatVariantMeta(variant: IProductVariant): string {
  return `${getPlatformLabel(variant.platform)} · ${getConditionLabel(variant.itemCondition)} · ${getDeliveryLabel(variant.deliveryType)}`;
}

//função para verificar se deve usar o modo compacto de variantes
export function shouldUseCompactVariantCards(variantCount: number): boolean {
  return variantCount <= COMPACT_VARIANT_THRESHOLD;
}

//interface para opção de dropdown de variantes
export interface VariantDropdownOption {
  label: string;
  value: string;
  disabled?: boolean;
  variant: IProductVariant;
}

//interface para grupo de dropdown de variantes
export interface VariantDropdownGroup {
  label: string;
  items: VariantDropdownOption[];
}

//função para formatar a label da opção de dropdown de variantes
export function formatVariantOptionLabel(variant: IProductVariant): string {
  const price = Number(variant.price);
  const listPrice =
    variant.listPrice != null ? Number(variant.listPrice) : null;
  const hasDiscount = listPrice != null && listPrice > price;
  const priceLabel = hasDiscount
    ? `${formatCurrency(listPrice)} ${formatCurrency(price)}`
    : formatCurrency(price);

  return `${variant.label} — ${priceLabel}`;
}

//função para construir os grupos de dropdown de variantes
export function buildVariantDropdownGroups(
  variants: IProductVariant[],
): VariantDropdownGroup[] {
  return groupProductVariants(variants).map((group) => ({
    label: group.title,
    items: group.variants.map((variant) => ({
      label: formatVariantOptionLabel(variant),
      value: getVariantKey(variant),
      disabled: !isVariantInStock(variant),
      variant,
    })),
  }));
}
