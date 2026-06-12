import { useMemo } from "react";
import { Dropdown } from "primereact/dropdown";
import type { IProductVariant } from "@/commons/types";
import { formatCurrency } from "@/utils/product-utils";
import {
  buildVariantDropdownGroups,
  formatVariantMeta,
  getVariantKey,
  groupProductVariants,
  isVariantInStock,
  shouldUseCompactVariantCards,
  type VariantDropdownOption,
} from "@/utils/variant-utils";
import "./styles.css";

interface ProductVariantPickerProps {
  variants: IProductVariant[];
  selectedVariantKey: string | null;
  onSelect: (key: string) => void;
  hasMultipleVariants: boolean;
}

interface VariantOptionButtonProps {
  variant: IProductVariant;
  isSelected: boolean;
  showMeta: boolean;
  onSelect: (key: string) => void;
}

function VariantPriceLabel({ variant }: { variant: IProductVariant }) {
  const price = Number(variant.price);
  const listPrice = variant.listPrice != null ? Number(variant.listPrice) : null;
  const hasDiscount = listPrice != null && listPrice > price;

  return (
    <span className="product-variant-picker__price">
      {hasDiscount && (
        <span className="product-variant-picker__list-price">
          {formatCurrency(listPrice)}
        </span>
      )}
      <span
        className={
          hasDiscount ? "product-variant-picker__sale-price" : undefined
        }
      >
        {formatCurrency(price)}
      </span>
    </span>
  );
}

function VariantDropdownLabel({ variant }: { variant: IProductVariant }) {
  return (
    <span className="product-variant-picker__dropdown-label">
      <span className="product-variant-picker__dropdown-name">
        {variant.label}
      </span>
      <span className="product-variant-picker__dropdown-sep"> — </span>
      <VariantPriceLabel variant={variant} />
    </span>
  );
}

function VariantOptionButton({
  variant,
  isSelected,
  showMeta,
  onSelect,
}: VariantOptionButtonProps) {
  const key = getVariantKey(variant);
  const inStock = isVariantInStock(variant);

  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      disabled={!inStock}
      className={`product-variant-picker__option${
        isSelected ? " product-variant-picker__option--selected" : ""
      }${!inStock ? " product-variant-picker__option--disabled" : ""}`}
      onClick={() => onSelect(key)}
    >
      <span className="product-variant-picker__option-main">
        <strong>{variant.label}</strong>
        <VariantPriceLabel variant={variant} />
      </span>
      {showMeta && (
        <span className="product-variant-picker__meta">
          {formatVariantMeta(variant)}
          {!inStock && (
            <span className="product-variant-picker__stock-badge">Esgotado</span>
          )}
        </span>
      )}
    </button>
  );
}

export function ProductVariantPicker({
  variants,
  selectedVariantKey,
  onSelect,
  hasMultipleVariants,
}: ProductVariantPickerProps) {
  const groups = useMemo(() => groupProductVariants(variants), [variants]);
  const useCompactCards = shouldUseCompactVariantCards(variants.length);
  const dropdownGroups = useMemo(
    () => buildVariantDropdownGroups(variants),
    [variants],
  );

  const selectedVariant = useMemo(
    () =>
      variants.find((variant) => getVariantKey(variant) === selectedVariantKey) ??
      null,
    [variants, selectedVariantKey],
  );

  const renderDropdownOption = (option: VariantDropdownOption) => (
    <VariantDropdownLabel variant={option.variant} />
  );

  const renderDropdownValue = (key: string | null) => {
    if (!key) {
      return <span>Selecione uma opção</span>;
    }

    const variant =
      variants.find((item) => getVariantKey(item) === key) ?? null;

    return variant ? (
      <VariantDropdownLabel variant={variant} />
    ) : (
      <span>{key}</span>
    );
  };

  if (variants.length === 0) {
    return null;
  }

  return (
    <section className="product-variant-picker">
      <h2>
        {hasMultipleVariants ? "Escolha uma opção" : "Opção disponível"}
      </h2>

      {useCompactCards ? (
        groups.map((group) => (
          <div key={group.key} className="product-variant-picker__group">
            {groups.length > 1 && (
              <h3 className="product-variant-picker__group-title">
                {group.title}
              </h3>
            )}
            <ul
              className="product-variant-picker__list product-variant-picker__list--compact"
              role="listbox"
            >
              {group.variants.map((variant) => {
                const key = getVariantKey(variant);
                const isSelected = selectedVariantKey === key;

                return (
                  <li key={key}>
                    <VariantOptionButton
                      variant={variant}
                      isSelected={isSelected}
                      showMeta={isSelected || variants.length === 1}
                      onSelect={onSelect}
                    />
                  </li>
                );
              })}
            </ul>
          </div>
        ))
      ) : (
        <div className="product-variant-picker__dropdown-wrap">
          <Dropdown
            inputId="product-variant-select"
            value={selectedVariantKey}
            onChange={(event) => {
              if (event.value) {
                onSelect(event.value);
              }
            }}
            options={dropdownGroups}
            optionLabel="label"
            optionValue="value"
            optionGroupLabel="label"
            optionGroupChildren="items"
            optionDisabled="disabled"
            itemTemplate={renderDropdownOption}
            valueTemplate={renderDropdownValue}
            placeholder="Selecione uma opção"
            className="product-variant-picker__dropdown"
            panelClassName="product-variant-picker__dropdown-panel"
            aria-label="Selecionar variação do produto"
          />

          {selectedVariant && (
            <p className="product-variant-picker__selection-detail">
              <span>{formatVariantMeta(selectedVariant)}</span>
              {!isVariantInStock(selectedVariant) && (
                <span className="product-variant-picker__stock-badge">
                  Esgotado
                </span>
              )}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
