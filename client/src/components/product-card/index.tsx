import { useNavigate } from "react-router-dom";
import type { IProduct } from "@/commons/types";
import { AddToCartFlow } from "@/components/add-to-cart-flow";
import { getProductImageUrl } from "@/utils/image-utils";
import {
  formatCurrency,
  formatVariantCount,
  getProductConditionBadge,
  getProductDiscountPercent,
  getProductDisplayPrice,
  getProductListPrice,
} from "@/utils/product-utils";
import { ProductRating } from "@/components/product-rating";
import { Card } from "primereact/card";
import "./styles.css";

interface ProductCardProps {
  product: IProduct;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const productUrl = `/catalog/product/${product.id}`;
  const price = getProductDisplayPrice(product);
  const listPrice = getProductListPrice(product);
  const discountPercent = getProductDiscountPercent(product);
  const variantHint = formatVariantCount(product);
  const conditionBadge = getProductConditionBadge(product);
  const hasMultipleOptions = variantHint != null;

  const openProductPage = () => {
    navigate(productUrl);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProductPage();
    }
  };

  return (
    <div className="product-card-wrapper">
      <Card
        className="product-card product-card--interactive"
        footer={
          <div
            className="product-card__actions"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => event.stopPropagation()}
          >
            <AddToCartFlow product={product} compact />
          </div>
        }
      >
        <div
          className="product-card__clickable"
          role="link"
          tabIndex={0}
          aria-label={`Ver detalhes de ${product.name}`}
          onClick={openProductPage}
          onKeyDown={handleCardKeyDown}
        >
          <div className="product-card__media">
            <img
              alt={product.name}
              src={getProductImageUrl(product.image)}
              className="product-card__image"
            />
            <span className="product-card__details-hint" aria-hidden>
              <i className="pi pi-search-plus" />
              Ver detalhes
            </span>
            {conditionBadge && (
              <span
                className={`product-card__badge product-card__badge--condition product-card__badge--${conditionBadge.tone.toLowerCase()}`}
              >
                <i className={`pi ${conditionBadge.iconClass}`} aria-hidden />
                {conditionBadge.label}
              </span>
            )}
            {discountPercent != null && (
              <span className="product-card__badge product-card__badge--discount">
                -{discountPercent}%
              </span>
            )}
            {variantHint && (
              <span className="product-card__badge product-card__badge--variants">
                {variantHint}
              </span>
            )}
          </div>

          <div className="product-card__meta">
            <h3 className="product-card__title">{product.name}</h3>

            <ProductRating
              averageRating={product.averageRating}
              reviewCount={product.reviewCount}
              compact
            />
          </div>

          <div className="product-card__pricing">
            {listPrice != null && (
              <span className="product-card__list-price">
                {formatCurrency(listPrice)}
              </span>
            )}
            <span className="product-card__price">
              {hasMultipleOptions ? "A partir de " : ""}
              {formatCurrency(price)}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
};
