import type { IProduct, IProductVariant } from "@/commons/types";
import { getProductImageUrl } from "@/utils/image-utils";
import { getActiveVariants } from "@/utils/product-utils";

export const CART_STORAGE_KEY = "thdfm_cart";

export interface CartItem {
  id: number;
  variantId?: number;
  nome: string;
  preco: number;
  imagem: string;
  quantidade: number;
  variante?: string;
}

export function readCartItems(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartItem[];
    return parsed.map((item) => ({
      ...item,
      quantidade: Number(item.quantidade) || 1,
      preco: Number(item.preco) || 0,
    }));
  } catch {
    return [];
  }
}

export function writeCartItems(items: CartItem[]): void {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cartUpdated"));
}

export function addVariantToCart(
  product: IProduct,
  variant: IProductVariant,
): boolean {
  if (product.id == null) {
    return false;
  }

  const items = readCartItems();
  const existingIndex = items.findIndex(
    (item) => item.id === product.id && item.variantId === variant.id,
  );

  if (existingIndex >= 0) {
    items[existingIndex].quantidade += 1;
  } else {
    items.push({
      id: product.id,
      variantId: variant.id,
      nome: product.name,
      preco: Number(variant.price),
      imagem: getProductImageUrl(product.image),
      quantidade: 1,
      variante: variant.label,
    });
  }

  writeCartItems(items);
  return true;
}

export function addProductToCart(product: IProduct): boolean {
  const activeVariants = getActiveVariants(product);
  if (activeVariants.length !== 1) {
    return false;
  }

  return addVariantToCart(product, activeVariants[0]);
}

export function getCartItemCount(): number {
  return readCartItems().reduce((total, item) => total + item.quantidade, 0);
}
