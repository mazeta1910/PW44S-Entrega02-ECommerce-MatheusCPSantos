import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { Button } from "primereact/button";
import type { IProduct } from "@/commons/types";
import Footer from "@/components/footer";
import { AddToCartFlow } from "@/components/add-to-cart-flow";
import { BuyNowFlow } from "@/components/buy-now-flow";
import { PageBreadcrumb } from "@/components/breadcrumb";
import { ProductCard } from "@/components/product-card";
import { ProductRating } from "@/components/product-rating";
import { ProductReviewsPanel } from "@/components/product-reviews-panel";
import { ProductVariantPicker } from "@/components/product-variant-picker";
import ProductService from "@/services/product-service";
import { getProductImageUrl } from "@/utils/image-utils";
import {
  formatCurrency,
  getActiveVariants,
  getProductDiscountPercent,
  getProductDisplayPrice,
  getProductListPrice,
  getSimilarProducts,
} from "@/utils/product-utils";
import {
  buildDeliveryInfo,
  getBestDefaultVariant,
  getVariantKey,
  isVariantInStock,
} from "@/utils/variant-utils";
import "./styles.css";

type ProductDetailTab = "about" | "reviews";

const PRODUCT_DETAIL_TABS: {
  id: ProductDetailTab;
  label: string;
  icon: string;
}[] = [
  { id: "about", label: "Sobre", icon: "pi-info-circle" },
  { id: "reviews", label: "Avaliações", icon: "pi-star" },
];

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [similarProducts, setSimilarProducts] = useState<IProduct[]>([]);
  const [selectedVariantKey, setSelectedVariantKey] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ProductDetailTab>("about");

  useEffect(() => {
    const loadProduct = async () => {
      const id = Number(productId);
      if (!productId || Number.isNaN(id) || id <= 0) {
        setErrorMessage("Produto inválido.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      const response = await ProductService.findById(id);
      if (response.success && response.data) {
        const loaded = response.data as IProduct;
        setProduct(loaded);

        const variants = getActiveVariants(loaded);
        const defaultVariant = getBestDefaultVariant(variants);
        setSelectedVariantKey(
          defaultVariant ? getVariantKey(defaultVariant) : null,
        );

        if (loaded.category?.id) {
          const categoryResponse = await ProductService.findByCategory(
            loaded.category.id,
          );
          if (categoryResponse.success && Array.isArray(categoryResponse.data)) {
            setSimilarProducts(
              getSimilarProducts(categoryResponse.data as IProduct[], loaded, 4),
            );
          } else {
            setSimilarProducts([]);
          }
        } else {
          setSimilarProducts([]);
        }
      } else {
        setProduct(null);
        setSimilarProducts([]);
        setErrorMessage(response.message ?? "Produto não encontrado.");
      }

      setIsLoading(false);
    };

    setActiveTab("about");
    loadProduct();
  }, [productId]);

  //pega variantes ativas do produto
  const activeVariants = useMemo(
    () => (product ? getActiveVariants(product) : []),
    [product],
  );

  //pega a variante selecionada
  const selectedVariant = useMemo(
    () =>
      activeVariants.find(
        (variant) => getVariantKey(variant) === selectedVariantKey,
      ) ?? null,
    [activeVariants, selectedVariantKey],
  );

  //verifica se a variante selecionada está em estoque
  const selectedInStock = selectedVariant
    ? isVariantInStock(selectedVariant)
    : false;

  //pega o preço de exibição da variante selecionada
  const displayPrice = selectedVariant
    ? Number(selectedVariant.price)
    : product
      ? getProductDisplayPrice(product)
      : 0;

  //pega o preço de lista da variante selecionada
  const selectedListPrice =
    selectedVariant?.listPrice != null
      ? Number(selectedVariant.listPrice)
      : null;

  //verifica se há desconto na variante selecionada
  const hasSelectedDiscount =
    selectedListPrice != null && selectedListPrice > displayPrice;

  //pega o preço de lista do produto
  const listPrice = product ? getProductListPrice(product) : null;
  //pega o percentual de desconto do produto
  const discountPercent = product ? getProductDiscountPercent(product) : null;
  //verifica se há múltiplas variantes do produto
  const hasMultipleVariants = activeVariants.length > 1;
  //pega a informação de entrega das variantes
  const deliveryInfo = buildDeliveryInfo(activeVariants);

  //pega o texto de especificações do produto
  const specificationsText =
    product?.specifications?.trim() ||
    "Especificações detalhadas conforme fabricante. Selecione uma opção para ver plataforma, condição e tipo de entrega.";

  //renderiza o componente
  return (
    <div className="page-container">
      <main className="product-detail-page">
        <PageBreadcrumb
          segments={
            product
              ? [
                  {
                    label: product.category?.name ?? "Produto",
                    to: "/catalog",
                  },
                  { label: product.name },
                ]
              : [{ label: "Produto" }]
          }
        />

        {isLoading ? (
          <p className="product-detail-message">Carregando produto...</p>
        ) : errorMessage || !product ? (
          <div className="product-detail-message product-detail-message--error">
            <p>{errorMessage ?? "Produto não encontrado."}</p>
            <Button
              label="Voltar ao catálogo"
              icon="pi pi-arrow-left"
              outlined
              onClick={() => navigate("/catalog")}
            />
          </div>
        ) : (
          <>
            <article className="product-detail">
              <div className="product-detail__gallery">
                <img
                  src={getProductImageUrl(product.image)}
                  alt={product.name}
                  className="product-detail__image"
                />
                {product.adultOnly && (
                  <span className="product-detail__adult-badge">+18</span>
                )}
                {discountPercent != null && (
                  <span className="product-detail__discount-badge">
                    -{discountPercent}%
                  </span>
                )}
              </div>

              <div className="product-detail__info product-detail__info--sticky">
                {product.category?.name && product.category.id && (
                  <Link
                    to={`/catalog?categories=${product.category.id}`}
                    className="product-detail__category"
                  >
                    {product.category.name}
                  </Link>
                )}

                <h1>{product.name}</h1>

                <ProductRating
                  averageRating={product.averageRating}
                  reviewCount={product.reviewCount}
                  compact
                />

                <div className="product-detail__pricing">
                  {//verifica se há desconto na variante selecionada
                  hasSelectedDiscount && (
                    //exibe o preço de lista
                    <span className="product-detail__list-price">
                      {formatCurrency(selectedListPrice)}
                    </span>
                  )}
                  {//verifica se não há desconto e se o preço de lista não é nulo e se não há variante selecionada
                  !hasSelectedDiscount && listPrice != null && !selectedVariant && (
                    //exibe o preço de lista
                    <span className="product-detail__list-price">
                      {formatCurrency(listPrice)}
                    </span>
                  )}
                  
                  <span className="product-detail__price">
                    //verifica se há múltiplas variantes e se não há variante selecionada
                    {hasMultipleVariants && !selectedVariant ? "A partir de " : ""}
                    {formatCurrency(displayPrice)}
                  </span>
                </div>


                //exibe o seletor de variantes
                <ProductVariantPicker
                  variants={activeVariants}
                  selectedVariantKey={selectedVariantKey}
                  onSelect={setSelectedVariantKey}
                  hasMultipleVariants={hasMultipleVariants}
                />

                <div className="product-detail__actions">
                  <AddToCartFlow
                    product={product}
                    selectedVariant={selectedVariant}
                    notifyWithToast
                    
                    disabled={!selectedVariant || !selectedInStock}
                  />
                  <BuyNowFlow
                    product={product}
                    selectedVariant={
                      selectedInStock ? selectedVariant : null
                    }
                  />
                  <Button
                    label="Voltar ao catálogo"
                    icon="pi pi-arrow-left"
                    outlined
                    className="product-detail__back-btn"
                    onClick={() => navigate("/catalog")}
                  />
                </div>

                {!selectedInStock && selectedVariant && (
                  <p className="product-detail__stock-warning" role="alert">
                    Esta opção está esgotada. Escolha outra variação disponível.
                  </p>
                )}
              </div>
            </article>

            <section
              className="product-detail__tabs-section"
              aria-label="Detalhes do produto"
            >
              <div className="product-detail__tabs-card">
                <div
                  className="product-detail__tabs"
                  role="tablist"
                  aria-label="Informações do produto"
                >
                  {PRODUCT_DETAIL_TABS.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      id={`product-tab-${tab.id}`}
                      aria-selected={activeTab === tab.id}
                      aria-controls={`product-tabpanel-${tab.id}`}
                      className={`product-detail__tab-btn${
                        activeTab === tab.id
                          ? " product-detail__tab-btn--active"
                          : ""
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      <i className={`pi ${tab.icon}`} aria-hidden />
                      <span>{tab.label}</span>
                      {tab.id === "reviews" &&
                        (product.reviewCount ?? 0) > 0 && (
                          <span className="product-detail__tab-badge">
                            {product.reviewCount}
                          </span>
                        )}
                    </button>
                  ))}
                </div>

                <div
                  className="product-detail__tab-panel"
                  role="tabpanel"
                  id={`product-tabpanel-${activeTab}`}
                  aria-labelledby={`product-tab-${activeTab}`}
                >
                  {activeTab === "about" && (
                    <div className="product-detail__about">
                      <p className="product-detail__tab-text">
                        {product.description}
                      </p>

                      <div className="product-detail__about-grid">
                        <article className="product-detail__about-card">
                          <h3>
                            <i className="pi pi-list" aria-hidden />
                            Especificações
                          </h3>
                          <p>{specificationsText}</p>
                        </article>
                        <article className="product-detail__about-card">
                          <h3>
                            <i className="pi pi-truck" aria-hidden />
                            Entrega
                          </h3>
                          <p className="product-detail__tab-text--pre">
                            {deliveryInfo}
                          </p>
                        </article>
                      </div>
                    </div>
                  )}

                  {activeTab === "reviews" && (
                    <ProductReviewsPanel product={product} />
                  )}
                </div>
              </div>
            </section>

            {similarProducts.length > 0 && (
              <section className="product-detail__similar">
                <h2>Itens semelhantes</h2>
                <p className="product-detail__similar-subtitle">
                  Outros produtos em {product.category?.name ?? "esta categoria"}
                </p>
                <div className="product-detail__similar-grid">
                  {similarProducts.map((item) => (
                    <ProductCard key={item.id} product={item} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
