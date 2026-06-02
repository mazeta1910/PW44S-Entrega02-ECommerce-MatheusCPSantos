import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Checkbox } from "primereact/checkbox";
import { Paginator, type PaginatorPageChangeEvent } from "primereact/paginator";
import { Button } from "primereact/button";
import type {
  DeliveryType,
  ICategory,
  IPage,
  IProduct,
  ItemCondition,
  Platform,
} from "@/commons/types";
import {
  CATALOG_CONDITION_FILTERS,
  CATALOG_DELIVERY_FILTERS,
  CATALOG_PLATFORM_FILTERS,
  getConditionLabel,
  getDeliveryLabel,
  getPlatformLabel,
} from "@/constants/catalog-filters";
import Footer from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { StoreBreadcrumb } from "@/components/store-breadcrumb";
import CategoryService from "@/services/category-service";
import ProductService from "@/services/product-service";
import "./styles.css";

const PAGE_SIZE = 6;

function parseIds(param: string | null): number[] {
  if (!param) return [];
  return param
    .split(",")
    .map((value) => Number(value))
    .filter((id) => !Number.isNaN(id) && id > 0);
}

function parseEnumList<T extends string>(param: string | null): T[] {
  if (!param) return [];
  return param.split(",").map((value) => value.trim()) as T[];
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>(() =>
    parseIds(searchParams.get("categories")),
  );
  const [selectedDeliveryTypes, setSelectedDeliveryTypes] = useState<
    DeliveryType[]
  >(() => parseEnumList<DeliveryType>(searchParams.get("delivery")));
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(() =>
    parseEnumList<Platform>(searchParams.get("platforms")),
  );
  const [selectedConditions, setSelectedConditions] = useState<ItemCondition[]>(
    () => parseEnumList<ItemCondition>(searchParams.get("conditions")),
  );
  const [page, setPage] = useState(() =>
    Number(searchParams.get("page") ?? "0"),
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const syncUrl = useCallback(
    (
      nextPage: number,
      categoryIds: number[],
      deliveryTypes: DeliveryType[],
      platforms: Platform[],
      itemConditions: ItemCondition[],
    ) => {
      const params = new URLSearchParams();
      if (nextPage > 0) params.set("page", String(nextPage));
      if (categoryIds.length > 0) params.set("categories", categoryIds.join(","));
      if (deliveryTypes.length > 0) params.set("delivery", deliveryTypes.join(","));
      if (platforms.length > 0) params.set("platforms", platforms.join(","));
      if (itemConditions.length > 0) {
        params.set("conditions", itemConditions.join(","));
      }
      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );

  const loadCatalog = useCallback(
    async (
      pageIndex: number,
      categoryIds: number[],
      deliveryTypes: DeliveryType[],
      platforms: Platform[],
      itemConditions: ItemCondition[],
    ) => {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await ProductService.findCatalog({
        page: pageIndex,
        size: PAGE_SIZE,
        categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
        deliveryTypes: deliveryTypes.length > 0 ? deliveryTypes : undefined,
        platforms: platforms.length > 0 ? platforms : undefined,
        itemConditions: itemConditions.length > 0 ? itemConditions : undefined,
      });

      if (response.success && response.data) {
        const pageData = response.data as IPage<IProduct>;
        setProducts(pageData.content ?? []);
        setTotalRecords(pageData.totalElements ?? 0);
      } else {
        setProducts([]);
        setTotalRecords(0);
        setErrorMessage(
          response.message ??
            "Não foi possível carregar o catálogo. Verifique se o servidor está em execução.",
        );
      }

      setIsLoading(false);
    },
    [],
  );

  useEffect(() => {
    const loadCategories = async () => {
      const response = await CategoryService.findAll();
      if (response.success && Array.isArray(response.data)) {
        setCategories(response.data as ICategory[]);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    loadCatalog(
      page,
      selectedCategoryIds,
      selectedDeliveryTypes,
      selectedPlatforms,
      selectedConditions,
    );
    syncUrl(
      page,
      selectedCategoryIds,
      selectedDeliveryTypes,
      selectedPlatforms,
      selectedConditions,
    );
  }, [
    page,
    selectedCategoryIds,
    selectedDeliveryTypes,
    selectedPlatforms,
    selectedConditions,
    loadCatalog,
    syncUrl,
  ]);

  const resetPage = () => setPage(0);

  const toggleCategory = (categoryId: number, checked: boolean) => {
    setSelectedCategoryIds((prev) => {
      if (checked) return prev.includes(categoryId) ? prev : [...prev, categoryId];
      return prev.filter((id) => id !== categoryId);
    });
    resetPage();
  };

  const toggleDelivery = (value: DeliveryType, checked: boolean) => {
    setSelectedDeliveryTypes((prev) => {
      if (checked) return prev.includes(value) ? prev : [...prev, value];
      return prev.filter((item) => item !== value);
    });
    resetPage();
  };

  const togglePlatform = (value: Platform, checked: boolean) => {
    setSelectedPlatforms((prev) => {
      if (checked) return prev.includes(value) ? prev : [...prev, value];
      return prev.filter((item) => item !== value);
    });
    resetPage();
  };

  const toggleCondition = (value: ItemCondition, checked: boolean) => {
    setSelectedConditions((prev) => {
      if (checked) return prev.includes(value) ? prev : [...prev, value];
      return prev.filter((item) => item !== value);
    });
    resetPage();
  };

  const clearFilters = () => {
    setSelectedCategoryIds([]);
    setSelectedDeliveryTypes([]);
    setSelectedPlatforms([]);
    setSelectedConditions([]);
    resetPage();
  };

  const hasActiveFilters =
    selectedCategoryIds.length > 0 ||
    selectedDeliveryTypes.length > 0 ||
    selectedPlatforms.length > 0 ||
    selectedConditions.length > 0;

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setPage(event.page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const breadcrumbTrail = useMemo(() => {
    const categoryLabels = categories
      .filter(
        (category) =>
          category.id != null && selectedCategoryIds.includes(category.id),
      )
      .map((category) => category.name);

    const deliveryLabels = selectedDeliveryTypes.map(getDeliveryLabel);
    const platformLabels = selectedPlatforms.map(getPlatformLabel);
    const conditionLabels = selectedConditions.map(getConditionLabel);

    return [...categoryLabels, ...deliveryLabels, ...platformLabels, ...conditionLabels];
  }, [
    categories,
    selectedCategoryIds,
    selectedDeliveryTypes,
    selectedPlatforms,
    selectedConditions,
  ]);

  return (
    <div className="page-container">
      <main className="catalog-page">
        <StoreBreadcrumb trail={breadcrumbTrail} />

        <header className="catalog-header">
          <div>
            <h1>Catálogo de produtos</h1>
            <p className="catalog-subtitle">
              Filtre por departamento, entrega, plataforma e estado do item.
              Combine livremente — só aparecem produtos com oferta compatível.
            </p>
          </div>
        </header>

        <div className="catalog-layout">
          <aside className="catalog-filters">
            <h2>Filtros</h2>

            <div className="filter-group">
              <h3 className="filter-group-title">Departamento</h3>
              <p className="filters-hint">Área da loja (categoria do produto)</p>
              <div className="category-checkboxes">
                {categories.map((category) => (
                  <label key={category.id} className="category-checkbox">
                    <Checkbox
                      inputId={`category-${category.id}`}
                      checked={
                        category.id != null &&
                        selectedCategoryIds.includes(category.id)
                      }
                      onChange={(e) =>
                        category.id != null &&
                        toggleCategory(category.id, e.checked ?? false)
                      }
                    />
                    <span>{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-group-title">Tipo de entrega</h3>
              <p className="filters-hint">Como o item é entregue (variação)</p>
              <div className="category-checkboxes">
                {CATALOG_DELIVERY_FILTERS.map((filter) => (
                  <label key={filter.value} className="category-checkbox">
                    <Checkbox
                      inputId={`delivery-${filter.value}`}
                      checked={selectedDeliveryTypes.includes(filter.value)}
                      onChange={(e) =>
                        toggleDelivery(filter.value, e.checked ?? false)
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
            </div>

            <div className="filter-group">
              <h3 className="filter-group-title">Plataforma</h3>
              <p className="filters-hint">Onde o jogo ou serviço é ativado</p>
              <div className="category-checkboxes">
                {CATALOG_PLATFORM_FILTERS.map((filter) => (
                  <label key={filter.value} className="category-checkbox">
                    <Checkbox
                      inputId={`platform-${filter.value}`}
                      checked={selectedPlatforms.includes(filter.value)}
                      onChange={(e) =>
                        togglePlatform(filter.value, e.checked ?? false)
                      }
                    />
                    <span>{filter.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h3 className="filter-group-title">Estado do item</h3>
              <p className="filters-hint">Novo, semi-novo ou usado (revenda)</p>
              <div className="category-checkboxes">
                {CATALOG_CONDITION_FILTERS.map((filter) => (
                  <label key={filter.value} className="category-checkbox">
                    <Checkbox
                      inputId={`condition-${filter.value}`}
                      checked={selectedConditions.includes(filter.value)}
                      onChange={(e) =>
                        toggleCondition(filter.value, e.checked ?? false)
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
            </div>

            {hasActiveFilters && (
              <Button
                type="button"
                label="Limpar todos os filtros"
                className="p-button-text p-button-sm"
                onClick={clearFilters}
              />
            )}
          </aside>

          <section className="catalog-results">
            <div className="catalog-results-header">
              <span>
                {totalRecords}{" "}
                {totalRecords === 1 ? "produto encontrado" : "produtos encontrados"}
              </span>
            </div>

            {isLoading ? (
              <div className="loading-message">Carregando produtos...</div>
            ) : errorMessage ? (
              <div className="loading-message error-message">{errorMessage}</div>
            ) : products.length === 0 ? (
              <div className="loading-message">
                Nenhum produto encontrado. Tente menos filtros ou outra combinação.
              </div>
            ) : (
              <>
                <div className="products-grid">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {totalRecords > PAGE_SIZE && (
                  <Paginator
                    first={page * PAGE_SIZE}
                    rows={PAGE_SIZE}
                    totalRecords={totalRecords}
                    onPageChange={onPageChange}
                    className="catalog-paginator"
                  />
                )}
              </>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
