export type PriceRange = [number, number];

export interface CatalogPriceBounds {
  min: number;
  max: number;
}

export const FALLBACK_PRICE_BOUNDS: CatalogPriceBounds = {
  min: 0,
  max: 5000,
};

export function parseCatalogPriceBounds(data: unknown): CatalogPriceBounds {
  if (!data || typeof data !== "object") {
    return FALLBACK_PRICE_BOUNDS;
  }

  const raw = data as { minPrice?: number | string; maxPrice?: number | string };
  const min = Number(raw.minPrice);
  const max = Number(raw.maxPrice);

  if (!Number.isFinite(min) || !Number.isFinite(max) || max < min) {
    return FALLBACK_PRICE_BOUNDS;
  }

  if (max === min) {
    return { min, max: min + 1 };
  }

  return { min, max };
}

export function getPriceSliderStep(bounds: CatalogPriceBounds): number {
  const span = bounds.max - bounds.min;
  if (span <= 200) return 1;
  if (span <= 1000) return 5;
  if (span <= 5000) return 10;
  return 50;
}

export function normalizePriceRange(
  range: PriceRange,
  bounds: CatalogPriceBounds,
): PriceRange {
  const min = Math.max(bounds.min, Math.min(range[0], range[1]));
  const max = Math.min(bounds.max, Math.max(range[0], range[1]));
  return [min, max];
}

export function isPriceFilterActive(
  range: PriceRange,
  bounds: CatalogPriceBounds,
): boolean {
  return range[0] > bounds.min || range[1] < bounds.max;
}

export function parsePriceParam(param: string | null): number | null {
  if (!param) return null;
  const value = Number(param);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

export function buildPriceRangeFromUrl(
  minParam: string | null,
  maxParam: string | null,
  bounds: CatalogPriceBounds,
): PriceRange {
  const urlMin = parsePriceParam(minParam);
  const urlMax = parsePriceParam(maxParam);

  if (urlMin == null && urlMax == null) {
    return [bounds.min, bounds.max];
  }

  return normalizePriceRange(
    [urlMin ?? bounds.min, urlMax ?? bounds.max],
    bounds,
  );
}
