import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import Footer from "@/components/footer";
import { readCartItems, writeCartItems } from "@/utils/cart-storage";
import { formatCurrency } from "@/utils/product-utils";
import "./styles.css";

interface CartItem {
  id: number;
  nome: string;
  imagem: string;
  preco: number;
  quantidade: number;
  variante?: string;
}

const FIXED_DISCOUNT = 0.0;
const PIX_DISCOUNT_PERCENT = 0.05;

export function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cepInput, setCepInput] = useState("");
  const [couponInput, setCouponInput] = useState("");

  // Load cart items from storage
  useEffect(() => {
    setCartItems(readCartItems());
  }, []);

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
    if (
      window.confirm(
        "Tem certeza que deseja remover TODOS os itens do carrinho?"
      )
    ) {
      updateCartStorage([]);
    }
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

  const valueWithDiscount = subtotal - FIXED_DISCOUNT;
  const pixDiscountValue = valueWithDiscount * PIX_DISCOUNT_PERCENT;
  const totalPix = valueWithDiscount - pixDiscountValue;

  const handleCepSubmit = () => {
    console.log("CEP calculado:", cepInput);
    // TODO: Implement CEP calculation
  };

  const handleCouponSubmit = () => {
    console.log("Cupom aplicado:", couponInput);
    // TODO: Implement coupon validation
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
              <div className="cart-status-header">
                <div className="status-bar">
                  <div className="status-step active">
                    <div className="step-circle">1</div>
                    <span>Carrinho</span>
                  </div>
                  <div className="status-separator"></div>
                  <div className="status-step">
                    <div className="step-circle">2</div>
                    <span>Identificação</span>
                  </div>
                  <div className="status-separator"></div>
                  <div className="status-step">
                    <div className="step-circle">3</div>
                    <span>Pagamento</span>
                  </div>
                </div>
              </div>

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

                    <div className="summary-row-new discount-row">
                      <span>Desconto Pix</span>
                      <span>- {formatCurrency(pixDiscountValue)}</span>
                    </div>

                    <div className="summary-row-new">
                      <span>Frete</span>
                      <span>A calcular</span>
                    </div>

                    <div className="summary-divider-new"></div>

                    <div className="summary-total-block">
                      <div className="summary-row-new total-row">
                        <span>Total da compra</span>
                        <span>{formatCurrency(totalPix)}</span>
                      </div>
                      <p className="total-details-card">
                        {formatCurrency(valueWithDiscount)} no cartão
                      </p>
                    </div>

                    <Button
                      label="Continuar"
                      className="btn-continue-checkout"
                      onClick={() => console.log("Proceed to checkout")}
                    />
                  </div>

                  <div className="extra-options-card">
                    <div className="delivery-section-sidebar">
                      <h5>Entrega</h5>
                      <div className="cep-input-group">
                        <InputText
                          placeholder="CEP"
                          className="cep-input"
                          value={cepInput}
                          onChange={(e) => setCepInput(e.target.value)}
                        />
                        <Button
                          label="OK"
                          className="btn-calculate"
                          onClick={handleCepSubmit}
                        />
                      </div>
                      <a href="#" className="link-policy">
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
                        />
                        <Button
                          label="OK"
                          className="btn-apply-new"
                          onClick={handleCouponSubmit}
                        />
                      </div>
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
