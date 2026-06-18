import { Link, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";
import { RadioButton } from "primereact/radiobutton";
import type { IAddress, ICouponValidation, IFreightOption } from "@/commons/types";
import Footer from "@/components/footer";
import { CheckoutStepBar } from "@/components/checkout-step-bar";
import { useAuth } from "@/context/hooks/use-auth";
import AddressService from "@/services/address-service";
import CouponService from "@/services/coupon-service";
import FreightService from "@/services/freight-service";
import OrderService from "@/services/order-service";
import { showAppToast } from "@/utils/app-toast";
import {
  readCheckoutAddressId,
  readCheckoutCoupon,
  readCheckoutFreight,
  readCheckoutPaymentMethod,
  writeCheckoutCoupon,
  writeCheckoutFreight,
  writeCheckoutPaymentMethod,
} from "@/utils/checkout-storage";
import {
  calculateCheckoutTotals,
  getPaymentMethodLabel,
  PAYMENT_METHOD_OPTIONS,
  type PaymentMethod,
} from "@/constants/payment-methods";
import {
  readCartItems,
  type CartItem,
} from "@/utils/cart-storage";
import { isValidZipCode } from "@/utils/cep-utils";
import { formatCurrency } from "@/utils/product-utils";
import { formatAddressLine } from "@/utils/user-utils";
import "../styles.css";

export function CheckoutPaymentPage() {
  const navigate = useNavigate();
  const { authenticated } = useAuth();
  const cartItems = readCartItems();
  const addressId = readCheckoutAddressId();

  const [deliveryAddress, setDeliveryAddress] = useState<IAddress | null>(null);
  const [freightOptions, setFreightOptions] = useState<IFreightOption[]>([]);
  const [selectedFreight, setSelectedFreight] = useState<IFreightOption | null>(
    readCheckoutFreight(),
  );
  const [appliedCoupon, setAppliedCoupon] = useState(readCheckoutCoupon());
  const [couponInput, setCouponInput] = useState(appliedCoupon?.code ?? "");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    readCheckoutPaymentMethod,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [freightLoading, setFreightLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.preco * item.quantidade,
        0,
      ),
    [cartItems],
  );

  const invalidItems = cartItems.filter((item) => item.variantId == null);

  const loadFreightForZip = async (zipCode: string) => {
    if (!isValidZipCode(zipCode)) {
      return;
    }

    setFreightLoading(true);
    const response = await FreightService.calculate(zipCode);
    setFreightLoading(false);

    if (response.success && Array.isArray(response.data)) {
      const options = response.data as IFreightOption[];
      setFreightOptions(options);

      const stored = readCheckoutFreight();
      const matched = stored
        ? options.find((option) => option.carrierId === stored.carrierId)
        : null;
      const nextSelection = matched ?? options[0] ?? null;
      setSelectedFreight(nextSelection);
      writeCheckoutFreight(nextSelection);
      return;
    }

    setFreightOptions([]);
    setSelectedFreight(null);
    writeCheckoutFreight(null);
    setErrorMessage(response.message ?? "Não foi possível calcular o frete.");
  };

  useEffect(() => {
    if (!authenticated || addressId == null) {
      setIsLoading(false);
      return;
    }

    const loadPaymentData = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await AddressService.findMyAddresses();
      if (!response.success || !Array.isArray(response.data)) {
        setErrorMessage(response.message ?? "Não foi possível carregar o endereço.");
        setIsLoading(false);
        return;
      }

      const addresses = response.data as IAddress[];
      const address = addresses.find((item) => item.id === addressId) ?? null;

      if (!address) {
        setErrorMessage("Endereço selecionado não foi encontrado.");
        setIsLoading(false);
        return;
      }

      setDeliveryAddress(address);
      await loadFreightForZip(address.zipCode);
      setIsLoading(false);
    };

    void loadPaymentData();
  }, [authenticated, addressId]);

  if (cartItems.length === 0 && !isSubmitting && !orderCompleted) {
    return <Navigate to="/cart" replace />;
  }

  if (!authenticated && !orderCompleted) {
    return <Navigate to="/checkout/identification" replace />;
  }

  if (addressId == null && !orderCompleted) {
    return <Navigate to="/checkout/identification" replace />;
  }

  const freightPrice = selectedFreight?.price ?? 0;
  const couponDiscount = appliedCoupon?.discountAmount ?? 0;
  const checkoutTotals = calculateCheckoutTotals(
    subtotal,
    freightPrice,
    couponDiscount,
    paymentMethod,
  );
  const { paymentDiscount, total: orderTotal, withFreight } = checkoutTotals;

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    writeCheckoutPaymentMethod(method);
  };

  const handleFreightChange = (option: IFreightOption) => {
    setSelectedFreight(option);
    writeCheckoutFreight(option);
  };

  const handleApplyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) {
      return;
    }

    setCouponLoading(true);
    const response = await CouponService.validate(code, subtotal);
    setCouponLoading(false);

    if (response.success && response.data) {
      const data = response.data as ICouponValidation;
      if (data.valid) {
        const coupon = { code: data.code, discountAmount: data.discountAmount };
        setAppliedCoupon(coupon);
        writeCheckoutCoupon(coupon);
        showAppToast({
          severity: "success",
          summary: "Cupom aplicado",
          detail: data.message,
        });
        return;
      }

      setAppliedCoupon(null);
      writeCheckoutCoupon(null);
      showAppToast({
        severity: "warn",
        summary: "Cupom inválido",
        detail: data.message,
      });
      return;
    }

    showAppToast({
      severity: "error",
      summary: "Cupom",
      detail: response.message ?? "Falha ao validar o cupom.",
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
    writeCheckoutCoupon(null);
  };

  const handleFinalizeOrder = async () => {
    if (deliveryAddress?.id == null) {
      return;
    }

    if (selectedFreight == null) {
      showAppToast({
        severity: "warn",
        summary: "Frete",
        detail: "Selecione uma opção de entrega para continuar.",
      });
      return;
    }

    if (!paymentMethod) {
      showAppToast({
        severity: "warn",
        summary: "Pagamento",
        detail: "Selecione uma forma de pagamento para continuar.",
      });
      return;
    }

    if (invalidItems.length > 0) {
      showAppToast({
        severity: "error",
        summary: "Carrinho desatualizado",
        detail:
          "Remova os itens antigos e adicione os produtos novamente antes de finalizar.",
      });
      return;
    }

    setIsSubmitting(true);

    const response = await OrderService.checkout({
      items: cartItems.map((item) => ({
        variantId: item.variantId!,
        quantity: item.quantidade,
      })),
      deliveryAddress: { id: deliveryAddress.id } as IAddress,
      freightPrice: selectedFreight.price,
      couponCode: appliedCoupon?.code,
      carrierName: selectedFreight.carrierName,
      estimatedDeliveryDays: selectedFreight.estimatedDays,
      paymentMethod,
    });

    if (response.success && response.data) {
      const order = response.data as { id?: number };
      setOrderCompleted(true);
      showAppToast({
        severity: "success",
        summary: "Pedido confirmado",
        detail: "Sua compra foi registrada com sucesso.",
      });
      if (order.id != null) {
        navigate(`/checkout/confirmation/${order.id}`, { replace: true });
      } else {
        navigate("/account/orders", { replace: true });
      }
      setIsSubmitting(false);
      return;
    }

    setIsSubmitting(false);

    showAppToast({
      severity: "error",
      summary: "Pedido",
      detail: response.message ?? "Não foi possível finalizar o pedido.",
    });
  };

  return (
    <div className="page-container">
      <main className="checkout-page">
        <div className="checkout-page__container">
          <CheckoutStepBar currentStep={3} />

          {isLoading ? (
            <div className="flex justify-content-center py-6">
              <ProgressSpinner aria-label="Carregando pagamento" />
            </div>
          ) : (
            <>
              {errorMessage && (
                <section className="checkout-card checkout-payment-alert">
                  <p>{errorMessage}</p>
                </section>
              )}

              <section className="checkout-card">
                <h1 className="checkout-card__title">Pagamento</h1>
                <p className="checkout-card__subtitle">
                  Revise os valores, confirme a entrega e finalize sua compra.
                </p>

                {deliveryAddress && (
                  <div className="checkout-payment-address">
                    <span className="checkout-info-item__label">
                      Endereço de entrega
                    </span>
                    <strong>
                      {deliveryAddress.street}, {deliveryAddress.number}
                    </strong>
                    <span>{formatAddressLine(deliveryAddress)}</span>
                  </div>
                )}
              </section>

              <section className="checkout-card">
                <h2 className="checkout-card__title">Opções de frete</h2>
                {freightLoading ? (
                  <div className="flex justify-content-center py-4">
                    <ProgressSpinner aria-label="Calculando frete" />
                  </div>
                ) : freightOptions.length === 0 ? (
                  <p className="checkout-card__subtitle">
                    Nenhuma opção de frete disponível para este CEP.
                  </p>
                ) : (
                  <div className="checkout-freight-list">
                    {freightOptions.map((option) => {
                      const inputId = `checkout-freight-${option.carrierId}`;
                      const isSelected =
                        selectedFreight?.carrierId === option.carrierId;

                      return (
                        <label
                          key={option.carrierId}
                          htmlFor={inputId}
                          className={`checkout-freight-option${
                            isSelected ? " checkout-freight-option--selected" : ""
                          }`}
                        >
                          <RadioButton
                            inputId={inputId}
                            name="checkout-freight"
                            value={option.carrierId}
                            checked={isSelected}
                            onChange={() => handleFreightChange(option)}
                          />
                          <span className="checkout-freight-option__body">
                            <strong>{option.carrierName}</strong>
                            <span>
                              Entrega em até {option.estimatedDays}{" "}
                              {option.estimatedDays === 1 ? "dia" : "dias"}
                            </span>
                          </span>
                          <span className="checkout-freight-option__price">
                            {formatCurrency(option.price)}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="checkout-card">
                <h2 className="checkout-card__title">Cupom de desconto</h2>
                <div className="checkout-coupon-row">
                  <InputText
                    placeholder="Código do cupom"
                    value={couponInput}
                    onChange={(event) => setCouponInput(event.target.value)}
                    disabled={couponLoading || isSubmitting}
                  />
                  <Button
                    type="button"
                    label="Aplicar"
                    onClick={() => void handleApplyCoupon()}
                    loading={couponLoading}
                    disabled={!couponInput.trim() || isSubmitting}
                  />
                  {appliedCoupon && (
                    <Button
                      type="button"
                      label="Remover"
                      severity="secondary"
                      outlined
                      onClick={handleRemoveCoupon}
                      disabled={isSubmitting}
                    />
                  )}
                </div>
                {appliedCoupon && (
                  <p className="checkout-coupon-applied">
                    Cupom <strong>{appliedCoupon.code}</strong> aplicado — desconto
                    de {formatCurrency(appliedCoupon.discountAmount)}
                  </p>
                )}
              </section>

              <section className="checkout-card">
                <h2 className="checkout-card__title">Forma de pagamento</h2>
                <p className="checkout-card__subtitle">
                  Escolha como deseja pagar. O Pix oferece 5% de desconto sobre
                  o total com frete.
                </p>
                <div className="checkout-payment-options">
                  {PAYMENT_METHOD_OPTIONS.map((option) => {
                    const inputId = `checkout-payment-${option.value}`;
                    const isSelected = paymentMethod === option.value;

                    return (
                      <label
                        key={option.value}
                        htmlFor={inputId}
                        className={`checkout-payment-option${
                          isSelected ? " checkout-payment-option--selected" : ""
                        }`}
                      >
                        <RadioButton
                          inputId={inputId}
                          name="checkout-payment-method"
                          value={option.value}
                          checked={isSelected}
                          onChange={() => handlePaymentMethodChange(option.value)}
                          disabled={isSubmitting}
                        />
                        <span className="checkout-payment-option__body">
                          <strong>
                            <i className={`pi ${option.icon}`} aria-hidden />{" "}
                            {option.label}
                          </strong>
                          <span>{option.hint}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </section>

              <section className="checkout-card">
                <h2 className="checkout-card__title">Resumo do pedido</h2>
                <ul className="checkout-order-items">
                  {cartItems.map((item: CartItem, index) => (
                    <li
                      key={`${item.id}-${item.variantId ?? index}`}
                      className="checkout-order-item"
                    >
                      <div>
                        <strong>{item.nome}</strong>
                        {item.variante && (
                          <span className="checkout-order-item__variant">
                            {item.variante}
                          </span>
                        )}
                        <span className="checkout-order-item__qty">
                          {item.quantidade}x {formatCurrency(item.preco)}
                        </span>
                      </div>
                      <span>{formatCurrency(item.preco * item.quantidade)}</span>
                    </li>
                  ))}
                </ul>

                <div className="checkout-summary-rows">
                  <div className="checkout-summary-row">
                    <span>Subtotal</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="checkout-summary-row">
                    <span>Frete</span>
                    <span>
                      {selectedFreight
                        ? formatCurrency(freightPrice)
                        : "A calcular"}
                    </span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="checkout-summary-row checkout-summary-row--discount">
                      <span>Cupom</span>
                      <span>- {formatCurrency(couponDiscount)}</span>
                    </div>
                  )}
                  {paymentDiscount > 0 && (
                    <div className="checkout-summary-row checkout-summary-row--discount">
                      <span>Desconto Pix (5%)</span>
                      <span>- {formatCurrency(paymentDiscount)}</span>
                    </div>
                  )}
                  <div className="checkout-summary-row checkout-summary-row--meta">
                    <span>Forma de pagamento</span>
                    <span>{getPaymentMethodLabel(paymentMethod)}</span>
                  </div>
                  <div className="checkout-summary-row checkout-summary-row--total">
                    <span>Total</span>
                    <span>{formatCurrency(orderTotal)}</span>
                  </div>
                  {paymentMethod !== "PIX" && (
                    <p className="checkout-summary-note">
                      {formatCurrency(withFreight)} antes do desconto Pix
                    </p>
                  )}
                </div>
              </section>

              <div className="checkout-actions">
                <Link to="/checkout/identification">
                  <Button
                    type="button"
                    label="Voltar para identificação"
                    icon="pi pi-arrow-left"
                    text
                    disabled={isSubmitting}
                  />
                </Link>

                <Button
                  type="button"
                  label="Finalizar compra"
                  icon="pi pi-check"
                  iconPos="right"
                  className="checkout-actions__primary"
                  loading={isSubmitting}
                  disabled={
                    isSubmitting ||
                    selectedFreight == null ||
                    invalidItems.length > 0
                  }
                  onClick={() => void handleFinalizeOrder()}
                />
              </div>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
