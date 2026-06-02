import type { IProduct } from "@/commons/types";
import {
  formatCurrency,
  formatVariantCount,
  getProductConditionBadge,
  getProductDiscountPercent,
  getProductDisplayPrice,
  getProductListPrice,
} from "@/utils/product-utils";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import "./styles.css";

interface ProductCardProps {
  product: IProduct;
}

const PLACEHOLDER_IMAGE =
  "https://primefaces.org/cdn/primereact/images/product/blue-band.jpg";

export const ProductCard = ({ product }: ProductCardProps) => {
  const price = getProductDisplayPrice(product);
  const listPrice = getProductListPrice(product);
  const discountPercent = getProductDiscountPercent(product);
  const variantHint = formatVariantCount(product);
  const conditionBadge = getProductConditionBadge(product);
  const hasMultipleOptions = variantHint != null;

  return (
    <div className="product-card-wrapper">
      <Card
        className="product-card"
        title={product.name}
        header={
          <div className="product-card__media">
            <img
              alt={product.name}
              src={product.image || PLACEHOLDER_IMAGE}
              className="product-card__image"
            />
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
          </div>
        }
        footer={
          <div className="product-card__actions">
            <Button
              label="Comprar"
              icon="pi pi-shopping-cart"
              className="p-button-sm"
            />
            <Button
              label="Detalhes"
              icon="pi pi-info-circle"
              className="p-button-secondary p-button-sm"
            />
          </div>
        }
      >
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
        <p className="product-card__description">{product.description}</p>
        {variantHint && (
          <p className="product-card__meta">{variantHint}</p>
        )}
      </Card>
    </div>
  );
};
