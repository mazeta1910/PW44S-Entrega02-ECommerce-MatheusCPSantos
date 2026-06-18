export type PaymentMethod =
  | "PIX"
  | "CREDIT_CARD"
  | "DEBIT_CARD"
  | "BOLETO"
  | "PAYPAL";

export const DEFAULT_PAYMENT_METHOD: PaymentMethod = "CREDIT_CARD";

export const PIX_DISCOUNT_PERCENT = 0.05;

export interface PaymentMethodOption {
  value: PaymentMethod;
  label: string;
  hint: string;
  icon: string;
}

export const PAYMENT_METHOD_OPTIONS: PaymentMethodOption[] = [
  {
    value: "PIX",
    label: "Pix",
    hint: "5% de desconto no total",
    icon: "pi-qrcode",
  },
  {
    value: "CREDIT_CARD",
    label: "Cartão de crédito",
    hint: "Parcelamento simulado",
    icon: "pi-credit-card",
  },
  {
    value: "DEBIT_CARD",
    label: "Cartão de débito",
    hint: "Débito à vista",
    icon: "pi-wallet",
  },
  {
    value: "BOLETO",
    label: "Boleto bancário",
    hint: "Vencimento em 3 dias úteis",
    icon: "pi-file",
  },
  {
    value: "PAYPAL",
    label: "PayPal",
    hint: "Checkout internacional",
    icon: "pi-paypal",
  },
];

export function getPaymentMethodLabel(method?: PaymentMethod | null): string {
  if (!method) {
    return "Não informado";
  }

  return (
    PAYMENT_METHOD_OPTIONS.find((option) => option.value === method)?.label ??
    method
  );
}

export function calculateCheckoutTotals(
  subtotal: number,
  freightPrice: number,
  couponDiscount: number,
  paymentMethod: PaymentMethod,
) {
  const safeSubtotal = Math.max(subtotal, 0);
  const safeFreight = Math.max(freightPrice, 0);
  const safeCoupon = Math.max(couponDiscount, 0);
  const afterCoupon = Math.max(safeSubtotal - safeCoupon, 0);
  const withFreight = afterCoupon + safeFreight;
  const paymentDiscount =
    paymentMethod === "PIX"
      ? Number((withFreight * PIX_DISCOUNT_PERCENT).toFixed(2))
      : 0;
  const total = Math.max(withFreight - paymentDiscount, 0);

  return {
    afterCoupon,
    withFreight,
    paymentDiscount,
    total,
  };
}
