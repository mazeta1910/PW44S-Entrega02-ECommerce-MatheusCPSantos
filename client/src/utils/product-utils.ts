import type { IProduct, ItemCondition } from "@/commons/types";
import { getConditionLabel } from "@/constants/catalog-filters";

const CONDITION_ORDER: ItemCondition[] = ["NEW", "SEMI_NEW", "USED"];

export function getProductDisplayPrice(product: IProduct): number {
  if (product.startingPrice != null) {
    return Number(product.startingPrice);
  }

  const activeVariants = (product.variants ?? []).filter(
    (variant) => variant.active !== false,
  );

  if (activeVariants.length === 0) {
    return 0;
  }

  return Math.min(...activeVariants.map((variant) => Number(variant.price)));
}

export function formatVariantCount(product: IProduct): string | null {
  const count = product.variants?.length ?? 0;
  if (count <= 1) {
    return null;
  }
  return `${count} opções`;
}

export function formatConditionSummary(product: IProduct): string | null {
  const activeVariants = (product.variants ?? []).filter(
    (variant) => variant.active !== false && variant.itemCondition,
  );
  if (activeVariants.length === 0) {
    return null;
  }

  const conditions = new Set(
    activeVariants.map((variant) => variant.itemCondition),
  );
  if (conditions.size === 1) {
    return getConditionLabel([...conditions][0]);
  }

  const labels = CONDITION_ORDER.filter((value) => conditions.has(value)).map(
    getConditionLabel,
  );
  return labels.join(" · ");
}
