import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import "./styles.css";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);

  // Carrega itens do localStorage ao iniciar
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("thdfm_cart")) || [];
    const normalizedCart = savedCart.map((item) => ({
      ...item,
      quantidade: Number(item.quantidade) || 1,
    }));
    setCartItems(normalizedCart);
  }, []);

  // Função para atualizar o localStorage e disparar evento
  const updateCartStorage = (newItems) => {
    setCartItems(newItems);
    localStorage.setItem("thdfm_cart", JSON.stringify(newItems));
    window.dispatchEvent(new Event("cartUpdated"));
  };

  // Remover item único
  const removeItem = (indexToRemove) => {
    const newItems = cartItems.filter((_, index) => index !== indexToRemove);
    updateCartStorage(newItems);
  };

  // --- NOVO: Limpar Carrinho Inteiro ---
  const clearCart = () => {
    if (window.confirm("Tem certeza que deseja remover TODOS os itens do carrinho?")) {
      updateCartStorage([]);
    }
  };
  // ------------------------------------

  // Atualizar quantidade
  const updateQuantity = (index, delta) => {
    const newItems = [...cartItems];
    const newQuantity = newItems[index].quantidade + delta;

    if (newQuantity >= 1) {
      newItems[index].quantidade = newQuantity;
      updateCartStorage(newItems);
    }
  };

  // Cálculos Financeiros
  const calcularSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.preco * item.quantidade,
      0
    );
  };

  const descontoFixo = 0.0;
  const subtotal = calcularSubtotal();
  const valorComDesconto = subtotal - descontoFixo;
  const descontoPixValor = valorComDesconto * 0.05;
  const totalPix = valorComDesconto - descontoPixValor;

  return (
    <div className="page-container">
      <Header />
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
                {/* COLUNA DA ESQUERDA: Lista de Produtos */}
                <div className="cart-left-column">
                  
                  {/* --- NOVO: Cabeçalho da Lista com Botão Limpar --- */}
                  <div className="cart-list-header-actions">
                    <h2>Itens no Carrinho ({cartItems.length})</h2>
                    <button className="btn-clear-all" onClick={clearCart}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Limpar Carrinho
                    </button>
                  </div>
                  {/* ------------------------------------------------ */}

                  <div className="cart-items-list">
                    {cartItems.map((item, index) => (
                      <div
                        key={`${item.id}-${index}`}
                        className="cart-item-row"
                      >
                        <div className="item-product-details">
                          <div className="product-image-new">
                            {/* --- NOVO: Link na Imagem --- */}
                            <Link to={`/produto/${item.id}`}>
                              <img
                                src={item.imagem}
                                alt={item.nome}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://via.placeholder.com/80";
                                }}
                              />
                            </Link>
                          </div>
                          <div className="product-info-new">
                            {/* --- NOVO: Link no Título --- */}
                            <Link to={`/produto/${item.id}`} className="product-name-link">
                              <h3 className="product-name-new">{item.nome}</h3>
                            </Link>
                            
                            <p className="product-spec">
                              Tamanho: {item.tamanho}
                            </p>
                            <p className="product-spec">Cor: {item.cor}</p>
                          </div>
                        </div>

                        <div className="item-quantity-controls">
                          <div className="quantity-control-new">
                            <button
                              className="quantity-btn-new"
                              onClick={() => updateQuantity(index, -1)}
                            >
                              -
                            </button>
                            <span className="quantity-number-new">
                              {item.quantidade}
                            </span>
                            <button
                              className="quantity-btn-new"
                              onClick={() => updateQuantity(index, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="item-total-value">
                          <div className="price-group">
                            <span className="price-pix">
                              R${" "}
                              {(item.preco * item.quantidade)
                                .toFixed(2)
                                .replace(".", ",")}
                            </span>
                            <span className="price-card">
                              Unid: R$ {item.preco.toFixed(2).replace(".", ",")}
                            </span>
                          </div>
                          <button
                            className="btn-remove-new"
                            title="Remover item"
                            onClick={() => removeItem(index)}
                          >
                            <svg
                              className="remove-icon"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUNA DA DIREITA: Resumo */}
                <div className="cart-right-column">
                  <div className="summary-card">
                    <h4>Resumo do Pedido</h4>

                    <div className="summary-row-new">
                      <span>Valor dos produtos</span>
                      <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
                    </div>

                    <div className="summary-row-new discount-row">
                      <span>Descontos</span>
                      <span>
                        - R$ {descontoFixo.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    <div className="summary-row-new discount-row">
                      <span>Desconto Pix</span>
                      <span>
                        - R$ {descontoPixValor.toFixed(2).replace(".", ",")}
                      </span>
                    </div>

                    <div className="summary-row-new">
                      <span>Frete</span>
                      <span>A calcular</span>
                    </div>

                    <div className="summary-divider-new"></div>

                    <div className="summary-total-block">
                      <div className="summary-row-new total-row">
                        <span>Total da compra</span>
                        <span>R$ {totalPix.toFixed(2).replace(".", ",")}</span>
                      </div>
                      <p className="total-details-card">
                        R$ {valorComDesconto.toFixed(2).replace(".", ",")} no
                        cartão
                      </p>
                    </div>

                    <button className="btn-continue-checkout">Continuar</button>
                  </div>

                  <div className="extra-options-card">
                    <div className="delivery-section-sidebar">
                      <h5>Entrega</h5>
                      <div className="cep-input-group">
                        <input
                          type="text"
                          placeholder="CEP"
                          className="cep-input"
                        />
                        <button className="btn-calculate">OK</button>
                      </div>
                      <a href="#" className="link-policy">
                        Não sei meu CEP
                      </a>
                    </div>

                    <div className="coupon-section-sidebar">
                      <h5>Cupom de Desconto</h5>
                      <div className="coupon-input-group-new">
                        <input
                          type="text"
                          placeholder="Código"
                          className="coupon-input-new"
                        />
                        <button className="btn-apply-new">OK</button>
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