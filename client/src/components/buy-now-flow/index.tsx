import { useNavigate } from "react-router-dom";
import type { IProduct, IProductVariant } from "@/commons/types";
import { addVariantToCart } from "@/utils/cart-storage";
import { Button } from "primereact/button";

interface BuyNowFlowProps {
  product: IProduct;
  selectedVariant: IProductVariant | null;
}

export function BuyNowFlow({ product, selectedVariant }: BuyNowFlowProps) {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    if (!selectedVariant) {
      return;
    }

    if (!addVariantToCart(product, selectedVariant)) {
      return;
    }

    navigate("/cart?checkout=1");
  };

  return (
    <Button
      label="Comprar agora"
      icon="pi pi-bolt"
      severity="success"
      className="buy-now-flow__btn"
      onClick={handleBuyNow}
      disabled={!selectedVariant}
    />
  );
}
