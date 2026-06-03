import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { IProduct, IProductVariant } from "@/commons/types";
import {
  getConditionLabel,
  getDeliveryLabel,
  getPlatformLabel,
} from "@/constants/catalog-filters";
import { addVariantToCart } from "@/utils/cart-storage";
import { formatCurrency, getActiveVariants } from "@/utils/product-utils";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { RadioButton } from "primereact/radiobutton";
import "./styles.css";

type DialogMode = "pick-variant" | "success";

interface AddToCartFlowProps {
  product: IProduct;
  /** Botões menores para uso no card da vitrine. */
  compact?: boolean;
}

export function AddToCartFlow({
  product,
  compact = false,
}: AddToCartFlowProps) {
  const navigate = useNavigate();
  const activeVariants = useMemo(
    () => getActiveVariants(product),
    [product],
  );
  const hasMultipleVariants = activeVariants.length > 1;

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>("pick-variant");
  const [selectedVariantKey, setSelectedVariantKey] = useState<string | null>(
    null,
  );
  const [addedVariantLabel, setAddedVariantLabel] = useState<string | null>(
    null,
  );

  const getVariantKey = (variant: IProductVariant) =>
    String(variant.id ?? variant.sku);

  const findSelectedVariant = (): IProductVariant | null => {
    if (!selectedVariantKey) return null;
    return (
      activeVariants.find(
        (variant) => getVariantKey(variant) === selectedVariantKey,
      ) ?? null
    );
  };

  const openSuccessDialog = (variantLabel: string) => {
    setAddedVariantLabel(variantLabel);
    setDialogMode("success");
    setDialogVisible(true);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setSelectedVariantKey(null);
    setAddedVariantLabel(null);
    setDialogMode("pick-variant");
  };

  const commitAdd = (variant: IProductVariant) => {
    if (!addVariantToCart(product, variant)) {
      return;
    }
    openSuccessDialog(variant.label);
  };

  const handleAddClick = () => {
    if (activeVariants.length === 0) {
      return;
    }

    if (hasMultipleVariants) {
      setDialogMode("pick-variant");
      setSelectedVariantKey(getVariantKey(activeVariants[0]));
      setDialogVisible(true);
      return;
    }

    commitAdd(activeVariants[0]);
  };

  const handleConfirmVariant = () => {
    const variant = findSelectedVariant();
    if (!variant) {
      return;
    }
    commitAdd(variant);
  };

  const buttonSize = compact ? "small" : undefined;
  const buttonClass = compact ? "p-button-sm" : undefined;

  return (
    <>
      <div
        className={`add-to-cart-flow${compact ? " add-to-cart-flow--compact" : ""}`}
      >
        <Button
          type="button"
          label="Adicionar ao carrinho"
          icon="pi pi-cart-plus"
          size={buttonSize}
          className={`${buttonClass ?? ""} add-to-cart-flow__cart-btn`.trim()}
          onClick={handleAddClick}
          disabled={activeVariants.length === 0}
        />
      </div>

      <Dialog
        className="add-to-cart-dialog"
        appendTo={typeof document !== "undefined" ? document.body : undefined}
        header={
          dialogMode === "success"
            ? "Adicionado ao carrinho"
            : "Escolha uma opção"
        }
        visible={dialogVisible}
        onHide={closeDialog}
        draggable={false}
        modal
        style={{ width: "min(420px, 92vw)" }}
      >
        {dialogMode === "success" ? (
          <div className="add-to-cart-dialog__success">
            <i className="pi pi-check-circle add-to-cart-dialog__success-icon" />
            <p>
              <strong>{product.name}</strong>
              {addedVariantLabel ? (
                <>
                  <br />
                  <span className="add-to-cart-dialog__variant-name">
                    {addedVariantLabel}
                  </span>
                </>
              ) : null}
            </p>
            <p className="add-to-cart-dialog__success-hint">
              O item foi adicionado ao seu carrinho.
            </p>
            <div className="add-to-cart-dialog__actions">
              <Button
                label="Continuar comprando"
                outlined
                onClick={closeDialog}
              />
              <Button
                label="Ver carrinho"
                icon="pi pi-shopping-cart"
                onClick={() => {
                  closeDialog();
                  navigate("/cart");
                }}
              />
            </div>
          </div>
        ) : (
          <div className="add-to-cart-dialog__picker">
            <p className="add-to-cart-dialog__hint">
              Selecione a variação que deseja adicionar:
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
                  listPrice != null && listPrice > price;

                return (
                  <li key={key}>
                    <label className="add-to-cart-dialog__variant-option">
                      <RadioButton
                        inputId={`variant-${product.id}-${key}`}
                        name={`variant-${product.id}`}
                        value={key}
                        onChange={(event) =>
                          setSelectedVariantKey(event.value as string)
                        }
                        checked={selectedVariantKey === key}
                      />
                      <span className="add-to-cart-dialog__variant-details">
                        <strong>{variant.label}</strong>
                        <span className="add-to-cart-dialog__variant-meta">
                          {getPlatformLabel(variant.platform)} ·{" "}
                          {getConditionLabel(variant.itemCondition)} ·{" "}
                          {getDeliveryLabel(variant.deliveryType)}
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
              <Button label="Cancelar" outlined onClick={closeDialog} />
              <Button
                label="Adicionar"
                icon="pi pi-cart-plus"
                onClick={handleConfirmVariant}
                disabled={!selectedVariantKey}
              />
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
