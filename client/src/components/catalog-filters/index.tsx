import { useMemo, useState } from "react";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Checkbox } from "primereact/checkbox";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Slider } from "primereact/slider";
import type {
  DeliveryType,
  ICategory,
  ItemCondition,
  Platform,
} from "@/commons/types";
import {
  CATALOG_CONDITION_FILTERS,
  CATALOG_DELIVERY_FILTERS,
  CATALOG_PLATFORM_FILTERS,
} from "@/constants/catalog-filters";
import { groupCategories } from "@/constants/category-groups";
import {
  getPriceSliderStep,
  type CatalogPriceBounds,
  type PriceRange,
} from "@/constants/catalog-price";
import { formatCurrency } from "@/utils/product-utils";
import "./styles.css";

interface CatalogFiltersProps {
  categories: ICategory[];
  selectedCategoryIds: number[];
  selectedDeliveryTypes: DeliveryType[];
  selectedPlatforms: Platform[];
  selectedConditions: ItemCondition[];
  onSaleOnly: boolean;
  priceBounds: CatalogPriceBounds | null;
  selectedPriceRange: PriceRange | null;
  isPriceFilterActive: boolean;
  hasActiveFilters: boolean;
  onToggleCategory: (categoryId: number, checked: boolean) => void;
  onToggleDelivery: (value: DeliveryType, checked: boolean) => void;
  onTogglePlatform: (value: Platform, checked: boolean) => void;
  onToggleCondition: (value: ItemCondition, checked: boolean) => void;
  onToggleOnSale: (checked: boolean) => void;
  onPriceRangeChange: (range: PriceRange) => void;
  onClearFilters: () => void;
}

function countSelectedInGroup(
  categories: ICategory[],
  selectedCategoryIds: number[],
): number {
  return categories.filter(
    (category) =>
      category.id != null && selectedCategoryIds.includes(category.id),
  ).length;
}

export function CatalogFilters({
  categories,
  selectedCategoryIds,
  selectedDeliveryTypes,
  selectedPlatforms,
  selectedConditions,
  onSaleOnly,
  priceBounds,
  selectedPriceRange,
  isPriceFilterActive,
  hasActiveFilters,
  onToggleCategory,
  onToggleDelivery,
  onTogglePlatform,
  onToggleCondition,
  onToggleOnSale,
  onPriceRangeChange,
  onClearFilters,
}: CatalogFiltersProps) {
  const [categoryQuery, setCategoryQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [draftPriceRange, setDraftPriceRange] = useState<PriceRange | null>(null);

  const categoryGroups = useMemo(() => groupCategories(categories), [categories]);

  const filteredGroups = useMemo(() => {
    const query = categoryQuery.trim().toLowerCase();
    if (!query) {
      return categoryGroups;
    }

    return categoryGroups
      .map((group) => ({
        ...group,
        categories: group.categories.filter((category) =>
          category.name.toLowerCase().includes(query),
        ),
      }))
      .filter((group) => group.categories.length > 0);
  }, [categoryGroups, categoryQuery]);

  const defaultAccordionIndexes = useMemo(() => {
    const indexes = [0];
    if (isPriceFilterActive) {
      indexes.push(1);
    }
    if (selectedCategoryIds.length > 0) {
      indexes.push(2);
    }
    return indexes;
  }, [isPriceFilterActive, selectedCategoryIds.length]);

  const sliderValue = draftPriceRange ?? selectedPriceRange;
  const sliderStep =
    priceBounds != null ? getPriceSliderStep(priceBounds) : 10;

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId],
    );
  };

  const activeFilterCount =
    selectedCategoryIds.length +
    selectedDeliveryTypes.length +
    selectedPlatforms.length +
    selectedConditions.length +
    (onSaleOnly ? 1 : 0) +
    (isPriceFilterActive ? 1 : 0);

  return (
    <aside className="catalog-filters">
      <div className="catalog-filters__header">
        <h2>Filtros</h2>
        {activeFilterCount > 0 && (
          <span className="catalog-filters__count">{activeFilterCount}</span>
        )}
      </div>

      <Accordion
        multiple
        activeIndex={defaultAccordionIndexes}
        className="catalog-filters__accordion"
      >
        <AccordionTab
          header={
            <span className="catalog-filters__tab-title">
              <i className="pi pi-percentage" aria-hidden />
              Ofertas
            </span>
          }
        >
          <label className="category-checkbox">
            <Checkbox
              inputId="filter-on-sale"
              checked={onSaleOnly}
              onChange={(event) => onToggleOnSale(event.checked ?? false)}
            />
            <span className="filter-label-block">
              <span>Somente em oferta</span>
              <small className="filter-option-hint">
                Produtos com preço promocional ativo
              </small>
            </span>
          </label>
        </AccordionTab>

        <AccordionTab
          header={
            <span className="catalog-filters__tab-title">
              <i className="pi pi-wallet" aria-hidden />
              Faixa de preço
              {isPriceFilterActive && sliderValue && (
                <span className="catalog-filters__tab-badge">1</span>
              )}
            </span>
          }
        >
          <p className="filters-hint">
            Com base no menor preço das variações ativas de cada produto
          </p>

          {priceBounds == null || sliderValue == null ? (
            <p className="catalog-filters__price-loading">Carregando faixa...</p>
          ) : (
            <div className="catalog-filters__price-range">
              <div className="catalog-filters__price-values">
                <span>{formatCurrency(sliderValue[0])}</span>
                <span>{formatCurrency(sliderValue[1])}</span>
              </div>

              <Slider
                value={sliderValue}
                onChange={(event) =>
                  setDraftPriceRange(event.value as PriceRange)
                }
                onSlideEnd={(event) => {
                  const nextRange = event.value as PriceRange;
                  setDraftPriceRange(null);
                  onPriceRangeChange(nextRange);
                }}
                range
                min={priceBounds.min}
                max={priceBounds.max}
                step={sliderStep}
                className="catalog-filters__price-slider"
              />

              <div className="catalog-filters__price-bounds">
                <span>{formatCurrency(priceBounds.min)}</span>
                <span>{formatCurrency(priceBounds.max)}</span>
              </div>
            </div>
          )}
        </AccordionTab>

        <AccordionTab
          header={
            <span className="catalog-filters__tab-title">
              <i className="pi pi-tags" aria-hidden />
              Departamento
              {selectedCategoryIds.length > 0 && (
                <span className="catalog-filters__tab-badge">
                  {selectedCategoryIds.length}
                </span>
              )}
            </span>
          }
        >
          <p className="filters-hint">Área da loja (categoria do produto)</p>
          <div className="catalog-filters__category-search">
            <i
              className="pi pi-search catalog-filters__category-search-icon"
              aria-hidden
            />
            <InputText
              value={categoryQuery}
              onChange={(event) => setCategoryQuery(event.target.value)}
              placeholder="Buscar departamento..."
              className="catalog-filters__category-search-input w-full"
            />
          </div>

          <div className="catalog-filters__groups">
            {filteredGroups.map((group) => {
              const selectedCount = countSelectedInGroup(
                group.categories,
                selectedCategoryIds,
              );
              const isExpanded =
                expandedGroups.includes(group.id) ||
                categoryQuery.trim().length > 0 ||
                selectedCount > 0;

              return (
                <div key={group.id} className="catalog-filter-subgroup">
                  <button
                    type="button"
                    className="catalog-filter-subgroup__trigger"
                    onClick={() => toggleGroup(group.id)}
                    aria-expanded={isExpanded}
                  >
                    <span className="catalog-filter-subgroup__label">
                      <i className={group.iconClass} aria-hidden />
                      {group.label}
                    </span>
                    <span className="catalog-filter-subgroup__meta">
                      {selectedCount > 0 && (
                        <span className="catalog-filters__tab-badge">
                          {selectedCount}
                        </span>
                      )}
                      <i
                        className={`pi ${isExpanded ? "pi-chevron-up" : "pi-chevron-down"}`}
                        aria-hidden
                      />
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="category-checkboxes catalog-filter-subgroup__items">
                      {group.categories.map((category) => (
                        <label key={category.id} className="category-checkbox">
                          <Checkbox
                            inputId={`category-${category.id}`}
                            checked={
                              category.id != null &&
                              selectedCategoryIds.includes(category.id)
                            }
                            onChange={(event) =>
                              category.id != null &&
                              onToggleCategory(category.id, event.checked ?? false)
                            }
                          />
                          <span>{category.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </AccordionTab>

        <AccordionTab
          header={
            <span className="catalog-filters__tab-title">
              <i className="pi pi-truck" aria-hidden />
              Tipo de entrega
              {selectedDeliveryTypes.length > 0 && (
                <span className="catalog-filters__tab-badge">
                  {selectedDeliveryTypes.length}
                </span>
              )}
            </span>
          }
        >
          <p className="filters-hint">Como o item é entregue (variação)</p>
          <div className="category-checkboxes">
            {CATALOG_DELIVERY_FILTERS.map((filter) => (
              <label key={filter.value} className="category-checkbox">
                <Checkbox
                  inputId={`delivery-${filter.value}`}
                  checked={selectedDeliveryTypes.includes(filter.value)}
                  onChange={(event) =>
                    onToggleDelivery(filter.value, event.checked ?? false)
                  }
                />
                <span className="filter-label-block">
                  <span>{filter.label}</span>
                  {filter.hint && (
                    <small className="filter-option-hint">{filter.hint}</small>
                  )}
                </span>
              </label>
            ))}
          </div>
        </AccordionTab>

        <AccordionTab
          header={
            <span className="catalog-filters__tab-title">
              <i className="pi pi-desktop" aria-hidden />
              Plataforma
              {selectedPlatforms.length > 0 && (
                <span className="catalog-filters__tab-badge">
                  {selectedPlatforms.length}
                </span>
              )}
            </span>
          }
        >
          <p className="filters-hint">Onde o jogo ou serviço é ativado</p>
          <div className="category-checkboxes">
            {CATALOG_PLATFORM_FILTERS.map((filter) => (
              <label key={filter.value} className="category-checkbox">
                <Checkbox
                  inputId={`platform-${filter.value}`}
                  checked={selectedPlatforms.includes(filter.value)}
                  onChange={(event) =>
                    onTogglePlatform(filter.value, event.checked ?? false)
                  }
                />
                <span>{filter.label}</span>
              </label>
            ))}
          </div>
        </AccordionTab>

        <AccordionTab
          header={
            <span className="catalog-filters__tab-title">
              <i className="pi pi-box" aria-hidden />
              Estado do item
              {selectedConditions.length > 0 && (
                <span className="catalog-filters__tab-badge">
                  {selectedConditions.length}
                </span>
              )}
            </span>
          }
        >
          <p className="filters-hint">Novo, semi-novo ou usado (revenda)</p>
          <div className="category-checkboxes">
            {CATALOG_CONDITION_FILTERS.map((filter) => (
              <label key={filter.value} className="category-checkbox">
                <Checkbox
                  inputId={`condition-${filter.value}`}
                  checked={selectedConditions.includes(filter.value)}
                  onChange={(event) =>
                    onToggleCondition(filter.value, event.checked ?? false)
                  }
                />
                <span className="filter-label-block">
                  <span>{filter.label}</span>
                  {filter.hint && (
                    <small className="filter-option-hint">{filter.hint}</small>
                  )}
                </span>
              </label>
            ))}
          </div>
        </AccordionTab>
      </Accordion>

      {hasActiveFilters && (
        <Button
          type="button"
          label="Limpar todos os filtros"
          className="p-button-text p-button-sm catalog-filters__clear"
          onClick={onClearFilters}
        />
      )}
    </aside>
  );
}
