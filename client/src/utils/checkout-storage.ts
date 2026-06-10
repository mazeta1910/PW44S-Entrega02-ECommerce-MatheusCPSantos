import type { IFreightOption } from "@/commons/types";

export const CHECKOUT_ADDRESS_KEY = "checkout_delivery_address_id";
export const CHECKOUT_FREIGHT_KEY = "checkout_freight_option";
export const CHECKOUT_COUPON_KEY = "checkout_coupon";
export const CART_FREIGHT_ZIP_KEY = "cart_freight_zip";

export interface CheckoutCoupon {
  code: string;
  discountAmount: number;
}

function readJson<T>(key: string): T | null {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeJson(key: string, value: unknown) {
  sessionStorage.setItem(key, JSON.stringify(value));
}

export function readCheckoutAddressId(): number | null {
  const raw = sessionStorage.getItem(CHECKOUT_ADDRESS_KEY);
  if (!raw) {
    return null;
  }
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : null;
}

export function writeCheckoutAddressId(addressId: number) {
  sessionStorage.setItem(CHECKOUT_ADDRESS_KEY, String(addressId));
}

export function readCheckoutFreight(): IFreightOption | null {
  return readJson<IFreightOption>(CHECKOUT_FREIGHT_KEY);
}

export function writeCheckoutFreight(option: IFreightOption | null) {
  if (!option) {
    sessionStorage.removeItem(CHECKOUT_FREIGHT_KEY);
    return;
  }
  writeJson(CHECKOUT_FREIGHT_KEY, option);
}

export function readCheckoutCoupon(): CheckoutCoupon | null {
  return readJson<CheckoutCoupon>(CHECKOUT_COUPON_KEY);
}

export function writeCheckoutCoupon(coupon: CheckoutCoupon | null) {
  if (!coupon) {
    sessionStorage.removeItem(CHECKOUT_COUPON_KEY);
    return;
  }
  writeJson(CHECKOUT_COUPON_KEY, coupon);
}

export function readCartFreightZip(): string {
  return sessionStorage.getItem(CART_FREIGHT_ZIP_KEY) ?? "";
}

export function writeCartFreightZip(zipCode: string) {
  if (!zipCode.trim()) {
    sessionStorage.removeItem(CART_FREIGHT_ZIP_KEY);
    return;
  }
  sessionStorage.setItem(CART_FREIGHT_ZIP_KEY, zipCode);
}

export function clearCheckoutSession() {
  sessionStorage.removeItem(CHECKOUT_ADDRESS_KEY);
  sessionStorage.removeItem(CHECKOUT_FREIGHT_KEY);
  sessionStorage.removeItem(CHECKOUT_COUPON_KEY);
}
