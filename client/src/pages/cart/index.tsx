import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Button } from "primereact/button";
import { confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { RadioButton } from "primereact/radiobutton";
import type { ICepLookup, ICouponValidation, IFreightOption } from "@/commons/types";
import Footer from "@/components/footer";
import { CheckoutStepBar } from "@/components/checkout-step-bar";
import { useAuth } from "@/context/hooks/use-auth";
import CouponService from "@/services/coupon-service";
import CepService from "@/services/cep-service";
import FreightService from "@/services/freight-service";
import { readCartItems, writeCartItems, type CartItem } from "@/utils/cart-storage";
import {
  readCartFreightZip,
  readCheckoutCoupon,
  readCheckoutFreight,
  writeCartFreightZip,
  writeCheckoutCoupon,
  writeCheckoutFreight,
} from "@/utils/checkout-storage";
import { formatZipCodeInput, isValidZipCode, normalizeZipCode } from "@/utils/cep-utils";
import { showAppToast } from "@/utils/app-toast";
import { formatCurrency } from "@/utils/product-utils";
import { PIX_DISCOUNT_PERCENT } from "@/constants/payment-methods";
import "./styles.css";

const FIXED_DISCOUNT = 0.0;

export function CartPage() {
  const navigate = useNavigate();
  const { authenticated } = useAuth();
  const [searchParams] = useSearchParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cepInput, setCepInput] = useState("");
  const [couponInput, setCouponInput] = useState("");
  const [freightOptions, setFreightOptions] = useState<IFreightOption[]>([]);
  const [selectedFreight, setSelectedFreight] = useState<IFreightOption | null>(
    null,
  );
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountAmount: number;
  } | null>(null);
  const [freightLoading, setFreightLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);
  const [cepFeedback, setCepFeedback] = useState<{
    message: string;
    tone: "warn" | "error";
  } | null>(null);

  useEffect(() => {
    setCartItems(readCartItems());
    const storedZip = readCartFreightZip();
    setCepInput(storedZip);
    setSelectedFreight(readCheckoutFreight());
    const storedCoupon = readCheckoutCoupon();
    setAppliedCoupon(storedCoupon);
    setCouponInput(storedCoupon?.code ?? "");
  }, []);

  useEffect(() => {
    if (searchParams.get("checkout") !== "1") {
      return;
    }

    const checkoutSection = document.getElementById("checkout-section");
    checkoutSection?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [searchParams, cartItems.length]);

  // Sync cart with other tabs/windows
  useEffect(() => {
    const syncCart = () => setCartItems(readCartItems());
    window.addEventListener("cartUpdated", syncCart);
    return () => window.removeEventListener("cartUpdated", syncCart);
  }, []);

  const updateCartStorage = useCallback((newItems: CartItem[]) => {
    setCartItems(newItems);
    writeCartItems(newItems);
  }, []);

  const removeItem = (indexToRemove: number) => {
    const newItems = cartItems.filter((_, index) => index !== indexToRemove);
    updateCartStorage(newItems);
  };

  const clearCart = () => {
    confirmDialog({
      message: "Tem certeza que deseja remover todos os itens do carrinho?",
      header: "Limpar carrinho",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Limpar",
      rejectLabel: "Cancelar",
      acceptClassName: "p-button-danger",
      accept: () => updateCartStorage([]),
    });
  };

  const updateQuantity = (index: number, delta: number) => {
    const newItems = [...cartItems];
    const newQuantity = newItems[index].quantidade + delta;

    if (newQuantity >= 1) {
      newItems[index].quantidade = newQuantity;
      updateCartStorage(newItems);
    }
  };

  // Financial calculations
  const subtotal = cartItems.reduce(
    (total, item) => total + item.preco * item.quantidade,
    0
  );

  const freightPrice = selectedFreight?.price ?? 0;
  const couponDiscount = appliedCoupon?.discountAmount ?? 0;
  const valueWithDiscount = Math.max(
    subtotal - FIXED_DISCOUNT - couponDiscount,
    0,
  );
  const valueWithFreight = valueWithDiscount + freightPrice;
  const pixDiscountPreview = valueWithFreight * PIX_DISCOUNT_PERCENT;
  const totalWithPixPreview = valueWithFreight - pixDiscountPreview;

  const handleCepChange = (value: string) => {
    const formatted = formatZipCodeInput(value);
    setCepInput(formatted);
    setCepError(null);
    setCepFeedback(null);

    const savedZip = readCartFreightZip();
    if (
      savedZip &&
      normalizeZipCode(formatted) !== normalizeZipCode(savedZip)
    ) {
      setFreightOptions([]);
      setSelectedFreight(null);
      writeCheckoutFreight(null);
    }
  };

  const validateCepInput = (): boolean => {
    const trimmed = cepInput.trim();

    if (!trimmed) {
      setCepError("Informe um CEP.");
      return false;
    }

    if (!isValidZipCode(trimmed)) {
      setCepError("Informe um CEP válido com 8 dígitos.");
      return false;
    }

    setCepError(null);
    return true;
  };

  const handleCepBlur = () => {
    if (!cepInput.trim()) {
      setCepError(null);
      return;
    }

    if (!isValidZipCode(cepInput)) {
      setCepError("Informe um CEP válido com 8 dígitos.");
    }
  };

  const handleCepSubmit = async () => {
    setCepFeedback(null);

    if (!validateCepInput()) {
      setFreightOptions([]);
      setSelectedFreight(null);
      writeCheckoutFreight(null);
      return;
    }

    setFreightLoading(true);
    const normalizedZip = normalizeZipCode(cepInput);

    const [cepResponse, freightResponse] = await Promise.all([
      CepService.lookup(normalizedZip),
      FreightService.calculate(normalizedZip),
    ]);

    setFreightLoading(false);

    if (cepResponse.success && cepResponse.data) {
      const cepData = cepResponse.data as ICepLookup;
      const resolvedZip = normalizeZipCode(cepData.zipCode || normalizedZip);
      setCepInput(resolvedZip);

      if (cepData.found === false) {
        setCepFeedback({
          message:
            cepResponse.message ??
            "CEP não encontrado na ViaCEP. Confira o código informado.",
          tone: "warn",
        });
      }
    } else {
      setCepFeedback({
        message: cepResponse.message ?? "Não foi possível consultar o CEP.",
        tone: "error",
      });
    }

    if (freightResponse.success && Array.isArray(freightResponse.data)) {
      const options = freightResponse.data as IFreightOption[];

      if (options.length === 0) {
        setFreightOptions([]);
        setSelectedFreight(null);
        writeCheckoutFreight(null);
        setCepFeedback({
          message: "Nenhuma opção de frete disponível para este CEP.",
          tone: "error",
        });
        return;
      }

      setFreightOptions(options);
      writeCartFreightZip(normalizedZip);

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
    setCepFeedback({
      message: freightResponse.message ?? "Não foi possível calcular o frete.",
      tone: "error",
    });
  };

  const handleFreightSelect = (option: IFreightOption) => {
    setSelectedFreight(option);
    writeCheckoutFreight(option);
  };

  const handleCouponSubmit = async () => {
    const code = couponInput.trim();
    if (!code) {
      return;
    }

    if (!authenticated) {
      showAppToast({
        severity: "info",
        summary: "Cupom",
        detail: "Entre na sua conta para aplicar um cupom de desconto.",
      });
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

  return (
    <div className="page-container">
      <main className="cart-main">
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h2>Seu carrinho está vazio</h2>
              <p>Adicione alguns produtos incríveis ao seu carrinho!</p>
              <Link to="/" className="btn-continue-shopping">
                Continuar Comprando
              </Link>
            </div>
          ) : (
            <div className="cart-content-new">
              <CheckoutStepBar currentStep={1} />

              <div className="cart-grid-layout">
                {/* Left Column: Product List */}
                <div className="cart-left-column">
                  <div className="cart-list-header-actions">
                    <h2>Itens no Carrinho ({cartItems.length})</h2>
                    <Button
                      icon="pi pi-trash"
                      label="Limpar Carrinho"
                      severity="danger"
                      text
                      onClick={clearCart}
                      className="btn-clear-all"
                    />
                  </div>

                  <div className="cart-items-list">
                    {cartItems.map((item, index) => (
                      <div key={`${item.id}-${index}`} className="cart-item-row">
                        <div className="item-product-details">
                          <div className="product-image-new">
                            <Link to={`/catalog/product/${item.id}`}>
                              <img
                                src={item.imagem}
                                alt={item.nome}
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.onerror = null;
                                  target.src =
                                    "https://via.placeholder.com/80";
                                }}
                              />
                            </Link>
                          </div>
                          <div className="product-info-new">
                            <Link
                              to={`/catalog/product/${item.id}`}
                              className="product-name-link"
                            >
                              <h3 className="product-name-new">{item.nome}</h3>
                            </Link>

                            {item.variante && (
                              <p className="product-spec">
                                Opção: {item.variante}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="item-quantity-controls">
                          <div className="quantity-control-new">
                            <Button
                              icon="pi pi-minus"
                              className="quantity-btn-new"
                              onClick={() => updateQuantity(index, -1)}
                              text
                            />
                            <span className="quantity-number-new">
                              {item.quantidade}
                            </span>
                            <Button
                              icon="pi pi-plus"
                              className="quantity-btn-new"
                              onClick={() => updateQuantity(index, 1)}
                              text
                            />
                          </div>
                        </div>

                        <div className="item-total-value">
                          <div className="price-group">
                            <span className="price-pix">
                              {formatCurrency(
                                item.preco * item.quantidade
                              )}
                            </span>
                            <span className="price-card">
                              Unid: {formatCurrency(item.preco)}
                            </span>
                          </div>
                          <Button
                            icon="pi pi-trash"
                            className="btn-remove-new"
                            text
                            severity="danger"
                            onClick={() => removeItem(index)}
                            title="Remover item"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Column: Summary */}
                <div className="cart-right-column">
                  <div className="summary-card">
                    <h4>Resumo do Pedido</h4>

                    <div className="summary-row-new">
                      <span>Valor dos produtos</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>

                    <div className="summary-row-new discount-row">
                      <span>Descontos</span>
                      <span>- {formatCurrency(FIXED_DISCOUNT)}</span>
                    </div>

                    {couponDiscount > 0 && (
                      <div className="summary-row-new discount-row">
                        <span>Cupom ({appliedCoupon?.code})</span>
                        <span>- {formatCurrency(couponDiscount)}</span>
                      </div>
                    )}

                    <div className="summary-row-new">
                      <span>Frete</span>
                      <span>
                        {selectedFreight
                          ? formatCurrency(freightPrice)
                          : "A calcular"}
                      </span>
                    </div>

                    <div className="summary-divider-new"></div>

                    <div id="checkout-section" className="summary-total-block">
                      <div className="summary-row-new total-row">
                        <span>Total estimado</span>
                        <span>{formatCurrency(valueWithFreight)}</span>
                      </div>
                      <p className="total-details-card">
                        Com Pix na etapa de pagamento:{" "}
                        {formatCurrency(totalWithPixPreview)} (5% off)
                      </p>
                    </div>

                    <Button
                      label="Continuar"
                      className="btn-continue-checkout"
                      onClick={() => navigate("/checkout/identification")}
                    />
                  </div>

                  <div className="extra-options-card">
                    <div className="delivery-section-sidebar">
                      <h5>Entrega</h5>
                      <div className="cep-input-group">
                        <InputText
                          placeholder="CEP"
                          className={`cep-input${cepError ? " p-invalid" : ""}`}
                          value={cepInput}
                          onChange={(e) => handleCepChange(e.target.value)}
                          onBlur={handleCepBlur}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              void handleCepSubmit();
                            }
                          }}
                          aria-invalid={Boolean(cepError)}
                          disabled={freightLoading}
                        />
                        <Button
                          label="OK"
                          className="btn-calculate"
                          onClick={() => void handleCepSubmit()}
                          loading={freightLoading}
                          disabled={freightLoading}
                        />
                      </div>
                      {cepError && (
                        <small className="cart-cep-error">{cepError}</small>
                      )}
                      {cepFeedback && (
                        <small
                          className={`cart-cep-feedback cart-cep-feedback--${cepFeedback.tone}`}
                        >
                          {cepFeedback.message}
                        </small>
                      )}
                      {freightOptions.length > 0 && (
                        <div className="cart-freight-options">
                          {freightOptions.map((option) => {
                            const inputId = `cart-freight-${option.carrierId}`;
                            const isSelected =
                              selectedFreight?.carrierId === option.carrierId;

                            return (
                              <label
                                key={option.carrierId}
                                htmlFor={inputId}
                                className={`cart-freight-option${
                                  isSelected ? " cart-freight-option--selected" : ""
                                }`}
                              >
                                <RadioButton
                                  inputId={inputId}
                                  name="cart-freight"
                                  value={option.carrierId}
                                  checked={isSelected}
                                  onChange={() => handleFreightSelect(option)}
                                />
                                <span className="cart-freight-option__body">
                                  <strong>{option.carrierName}</strong>
                                  <span>
                                    {option.estimatedDays}{" "}
                                    {option.estimatedDays === 1 ? "dia" : "dias"} —{" "}
                                    {formatCurrency(option.price)}
                                  </span>
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      )}
                      <a
                        href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                        className="link-policy"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Não sei meu CEP
                      </a>
                    </div>

                    <div className="coupon-section-sidebar">
                      <h5>Cupom de Desconto</h5>
                      <div className="coupon-input-group-new">
                        <InputText
                          placeholder="Código"
                          className="coupon-input-new"
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value)}
                          disabled={couponLoading}
                        />
                        <Button
                          label="OK"
                          className="btn-apply-new"
                          onClick={() => void handleCouponSubmit()}
                          loading={couponLoading}
                        />
                      </div>
                      {appliedCoupon && (
                        <div className="cart-coupon-applied">
                          <span>
                            Cupom {appliedCoupon.code} aplicado (
                            {formatCurrency(appliedCoupon.discountAmount)})
                          </span>
                          <Button
                            type="button"
                            label="Remover"
                            text
                            size="small"
                            onClick={handleRemoveCoupon}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
