import type { IProduct } from "@/commons/types";
import {
  formatConditionSummary,
  formatVariantCount,
  getProductDisplayPrice,
} from "@/utils/product-utils";
import { Button } from "primereact/button";
import { Card } from "primereact/card";

interface ProductCardProps {
  product: IProduct;
}

const PLACEHOLDER_IMAGE =
  "https://primefaces.org/cdn/primereact/images/product/blue-band.jpg";

export const ProductCard = ({ product }: ProductCardProps) => {
  const price = getProductDisplayPrice(product);
  const variantHint = formatVariantCount(product);
  const conditionHint = formatConditionSummary(product);
  const priceLabel =
    variantHint != null
      ? `A partir de R$ ${price.toFixed(2)}`
      : `R$ ${price.toFixed(2)}`;

  return (
    <div key={product.id} className="p-col-12 p-sm-6 p-md-4 p-lg-3 mb-4">
      <Card
        title={product.name}
        subTitle={priceLabel}
        header={
          <img
            alt={product.name}
            src={product.image || PLACEHOLDER_IMAGE}
            style={{ width: "100%", height: "200px", objectFit: "cover" }}
          />
        }
        footer={
          <div>
            <Button
              label="Comprar"
              icon="pi pi-shopping-cart"
              className="p-button-sm p-mr-2"
            />
            <Button
              label="Detalhes"
              icon="pi pi-info-circle"
              className="p-button-secondary p-button-sm"
            />
          </div>
        }
      >
        <p>{product.description}</p>
        {(variantHint || conditionHint) && (
          <p className="text-sm text-color-secondary mt-2">
            {[variantHint, conditionHint].filter(Boolean).join(" · ")}
          </p>
        )}
      </Card>
    </div>
  );
};
