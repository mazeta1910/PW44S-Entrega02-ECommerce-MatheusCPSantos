import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { IProduct, IProductVariant } from "@/commons/types";

import {
  getConditionLabel,
  getDeliveryLabel,
  getPlatformLabel,
} from "@/constants/catalog-filters";

import {
  formatCurrency,
  getActiveVariants,
} from "@/utils/product-utils";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { RadioButton } from "primereact/radiobutton";

interface BuyNowFlowProps {
  product: IProduct;
}

export function BuyNowFlow({ product }: BuyNowFlowProps) {
  const navigate = useNavigate();

  const activeVariants = useMemo(
    () => getActiveVariants(product),
    [product]
  );

  const hasMultipleVariants = activeVariants.length > 1;

  const [dialogVisible, setDialogVisible] = useState(false);

  const [selectedVariantKey, setSelectedVariantKey] = useState<
    string | null
  >(null);

  const getVariantKey = (variant: IProductVariant) =>
    String(variant.id ?? variant.sku);

  const findSelectedVariant = () => {
    if (!selectedVariantKey) return null;

    return (
      activeVariants.find(
        (variant) =>
          getVariantKey(variant) === selectedVariantKey
      ) ?? null
    );
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setSelectedVariantKey(null);
  };

  const goToCheckout = (variant: IProductVariant) => {
    navigate("/", {
      state: {
        product,
        variant,
      },
    });
  };

  const handleBuyNow = () => {
    if (activeVariants.length === 0) {
      return;
    }

    if (hasMultipleVariants) {
      setSelectedVariantKey(
        getVariantKey(activeVariants[0])
      );

      setDialogVisible(true);
      return;
    }

    goToCheckout(activeVariants[0]);
  };

  const handleConfirm = () => {
    const variant = findSelectedVariant();

    if (!variant) {
      return;
    }

    goToCheckout(variant);
  };

  return (
    <>
      <Button
        label="Comprar agora"
        icon="pi pi-bolt"
        severity="success"
        onClick={handleBuyNow}
        disabled={activeVariants.length === 0}
      />

      <Dialog
        header="Escolha uma opção"
        visible={dialogVisible}
        onHide={closeDialog}
        modal
        draggable={false}
        style={{ width: "min(420px, 92vw)" }}
      >
        <div>
          <p>
            Selecione a variação desejada:
          </p>

          <ul className="add-to-cart-dialog__variant-list">
            {activeVariants.map((variant) => {
              const key = getVariantKey(variant);

              const listPrice =
                variant.listPrice != null
                  ? Number(variant.listPrice)
                  : null;

              const price = Number(variant.price);

              const hasDiscount =
                listPrice != null &&
                listPrice > price;

              return (
                <li key={key}>
                  <label className="add-to-cart-dialog__variant-option">
                    <RadioButton
                      inputId={`buy-${product.id}-${key}`}
                      name={`buy-${product.id}`}
                      value={key}
                      checked={selectedVariantKey === key}
                      onChange={(e) =>
                        setSelectedVariantKey(
                          e.value as string
                        )
                      }
                    />

                    <span className="add-to-cart-dialog__variant-details">
                      <strong>{variant.label}</strong>

                      <span className="add-to-cart-dialog__variant-meta">
                        {getPlatformLabel(
                          variant.platform
                        )}
                        {" · "}
                        {getConditionLabel(
                          variant.itemCondition
                        )}
                        {" · "}
                        {getDeliveryLabel(
                          variant.deliveryType
                        )}
                      </span>

                      <span className="add-to-cart-dialog__variant-price">
                        {hasDiscount && (
                          <span className="add-to-cart-dialog__list-price">
                            {formatCurrency(listPrice)}
                          </span>
                        )}

                        {formatCurrency(price)}
                      </span>
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>

          <div className="add-to-cart-dialog__actions">
            <Button
              label="Cancelar"
              outlined
              onClick={closeDialog}
            />

            <Button
              label="Continuar"
              icon="pi pi-arrow-right"
              onClick={handleConfirm}
              disabled={!selectedVariantKey}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
}