import type { IProduct, ItemCondition } from "@/commons/types";
import { getConditionLabel } from "@/constants/catalog-filters";

const CONDITION_ORDER: ItemCondition[] = ["NEW", "SEMI_NEW", "USED"];

const CONDITION_BADGE_ICONS: Record<ItemCondition, string> = {
  NEW: "pi-sparkles",
  SEMI_NEW: "pi-history",
  USED: "pi-refresh",
};

export function formatCurrency(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

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

export function getActiveVariants(product: IProduct) {
  return (product.variants ?? []).filter((variant) => variant.active !== false);
}

export function hasProductDiscount(product: IProduct): boolean {
  return getActiveVariants(product).some((variant) => {
    const listPrice = variant.listPrice;
    return listPrice != null && Number(listPrice) > Number(variant.price);
  });
}

export function getProductDiscountPercent(product: IProduct): number | null {
  const offer = getProductPromoOffer(product);
  return offer?.discountPercent ?? null;
}

export function getProductListPrice(product: IProduct): number | null {
  const offer = getProductPromoOffer(product);
  return offer?.listPrice ?? null;
}

export function getProductPromoOffer(product: IProduct): {
  price: number;
  listPrice: number;
  discountPercent: number;
} | null {
  const displayPrice = getProductDisplayPrice(product);
  const activeVariants = getActiveVariants(product);

  const atDisplayPrice = activeVariants.filter(
    (variant) => Number(variant.price) === displayPrice,
  );

  for (const variant of atDisplayPrice) {
    const listPrice = variant.listPrice;
    if (listPrice != null && Number(listPrice) > displayPrice) {
      return buildOffer(displayPrice, Number(listPrice));
    }
  }

  let best: ReturnType<typeof buildOffer> | null = null;
  for (const variant of activeVariants) {
    const listPrice = variant.listPrice;
    const price = Number(variant.price);
    if (listPrice == null || Number(listPrice) <= price) {
      continue;
    }
    const offer = buildOffer(price, Number(listPrice));
    if (!best || offer.discountPercent > best.discountPercent) {
      best = offer;
    }
  }

  return best;
}

function buildOffer(price: number, listPrice: number) {
  return {
    price,
    listPrice,
    discountPercent: Math.round((1 - price / listPrice) * 100),
  };
}

export function formatVariantCount(product: IProduct): string | null {
  const count = product.variants?.length ?? 0;
  if (count <= 1) {
    return null;
  }
  return `${count} opções`;
}

export function formatConditionSummary(product: IProduct): string | null {
  const activeVariants = getActiveVariants(product).filter(
    (variant) => variant.itemCondition,
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

export function getProductConditionBadge(product: IProduct): {
  label: string;
  iconClass: string;
  tone: ItemCondition;
} | null {
  const activeVariants = getActiveVariants(product).filter(
    (variant) => variant.itemCondition,
  );
  if (activeVariants.length === 0) {
    return null;
  }

  const conditions = new Set(
    activeVariants.map((variant) => variant.itemCondition),
  );
  if (conditions.size !== 1) {
    return null;
  }

  const condition = [...conditions][0];
  return {
    label: getConditionLabel(condition),
    iconClass: CONDITION_BADGE_ICONS[condition],
    tone: condition,
  };
}

export function getPromoProducts(products: IProduct[], limit?: number): IProduct[] {
  const promos = products
    .filter(hasProductDiscount)
    .sort((a, b) => {
      const discountA = getProductDiscountPercent(a) ?? 0;
      const discountB = getProductDiscountPercent(b) ?? 0;
      return discountB - discountA;
    });

  return limit != null ? promos.slice(0, limit) : promos;
}

export function getSimilarProducts(
  products: IProduct[],
  current: IProduct,
  limit = 4,
): IProduct[] {
  const currentId = current.id;

  return products
    .filter((product) => product.id != null && product.id !== currentId)
    .slice(0, limit);
}
