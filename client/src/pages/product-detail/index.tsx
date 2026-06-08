import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import type { IProduct } from "@/commons/types";
import Footer from "@/components/footer";
import { AddToCartFlow } from "@/components/add-to-cart-flow";
import { BuyNowFlow } from "@/components/buy-now-flow";
import { PageBreadcrumb } from "@/components/breadcrumb";
import {
  getConditionLabel,
  getDeliveryLabel,
  getPlatformLabel,
} from "@/constants/catalog-filters";
import ProductService from "@/services/product-service";
import { getProductImageUrl } from "@/utils/image-utils";
import {
  formatCurrency,
  getProductDiscountPercent,
  getProductDisplayPrice,
  getProductListPrice,
} from "@/utils/product-utils";
import "./styles.css";

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        setProduct(response.data as IProduct);
      } else {
        setProduct(null);
        setErrorMessage(response.message ?? "Produto não encontrado.");
      }

      setIsLoading(false);
    };

    loadProduct();
  }, [productId]);

  const activeVariants =
    product?.variants?.filter((variant) => variant.active !== false) ?? [];
  const displayPrice = product ? getProductDisplayPrice(product) : 0;
  const listPrice = product ? getProductListPrice(product) : null;
  const discountPercent = product ? getProductDiscountPercent(product) : null;
  const hasMultipleVariants = activeVariants.length > 1;
  const productUrl = product ? `/catalog/product/${product.id}` : "/catalog";

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
          <article className="product-detail">
            <div className="product-detail__gallery">
              <img
                src={getProductImageUrl(product.image)}
                alt={product.name}
                className="product-detail__image"
              />
              {discountPercent != null && (
                <span className="product-detail__discount-badge">
                  -{discountPercent}%
                </span>
              )}
            </div>

            <div className="product-detail__info">
              {product.category?.name && product.category.id && (
                <Link
                  to={`/catalog?categories=${product.category.id}`}
                  className="product-detail__category"
                >
                  {product.category.name}
                </Link>
              )}

              <h1>{product.name}</h1>

              <div className="product-detail__pricing">
                {listPrice != null && (
                  <span className="product-detail__list-price">
                    {formatCurrency(listPrice)}
                  </span>
                )}
                <span className="product-detail__price">
                  {hasMultipleVariants ? "A partir de " : ""}
                  {formatCurrency(displayPrice)}
                </span>
              </div>

              <p className="product-detail__description">{product.description}</p>

              {product.adultOnly && (
                <Tag severity="danger" value="+18" className="product-detail__tag" />
              )}

              <div className="product-detail__actions">
                {product && <AddToCartFlow product={product} />}
                <Button
                  label="Voltar ao catálogo"
                  icon="pi pi-arrow-left"
                  outlined
                  onClick={() => navigate("/catalog")}
                />
                <BuyNowFlow product={product} />
              </div>

              {activeVariants.length > 0 && (
                <section className="product-detail__variants">
                  <h2>Opções disponíveis</h2>
                  <ul className="product-detail__variant-list">
                    {activeVariants.map((variant) => {
                      const price = Number(variant.price);
                      const listPrice =
                        variant.listPrice != null
                          ? Number(variant.listPrice)
                          : null;
                      const hasDiscount =
                        listPrice != null && listPrice > price;

                      return (
                        <li key={variant.id ?? variant.sku}>
                          <strong>{variant.label}</strong>
                          <span className="product-detail__variant-price">
                            {hasDiscount && (
                              <span className="product-detail__list-price">
                                {formatCurrency(listPrice)}
                              </span>
                            )}
                            {formatCurrency(price)}
                          </span>
                          <span>
                            {getPlatformLabel(variant.platform)} ·{" "}
                            {getConditionLabel(variant.itemCondition)} ·{" "}
                            {getDeliveryLabel(variant.deliveryType)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              )}
            </div>
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
