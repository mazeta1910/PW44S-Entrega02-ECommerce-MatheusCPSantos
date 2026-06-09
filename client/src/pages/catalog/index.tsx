import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Paginator, type PaginatorPageChangeEvent } from "primereact/paginator";
import { Dropdown } from "primereact/dropdown";
import type {
  DeliveryType,
  ICategory,
  IPage,
  IProduct,
  ItemCondition,
  Platform,
} from "@/commons/types";
import {
  getConditionLabel,
  getDeliveryLabel,
  getPlatformLabel,
} from "@/constants/catalog-filters";
import {
  CATALOG_SORT_OPTIONS,
  DEFAULT_CATALOG_SORT,
  getCatalogSortLabel,
  parseCatalogSort,
  type CatalogSort,
} from "@/constants/catalog-sort";
import {
  buildPriceRangeFromUrl,
  FALLBACK_PRICE_BOUNDS,
  isPriceFilterActive,
  normalizePriceRange,
  parseCatalogPriceBounds,
  type CatalogPriceBounds,
  type PriceRange,
} from "@/constants/catalog-price";
import { formatCurrency } from "@/utils/product-utils";
import Footer from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { PageBreadcrumb } from "@/components/breadcrumb";
import { CatalogFilters } from "@/components/catalog-filters";
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

function parseOnSale(param: string | null): boolean {
  return param === "true" || param === "1";
}

function sameNumberArray(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort((x, y) => x - y);
  const sortedB = [...b].sort((x, y) => x - y);
  return sortedA.every((value, index) => value === sortedB[index]);
}

function sameStringArray(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((value, index) => value === sortedB[index]);
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
  const [onSaleOnly, setOnSaleOnly] = useState(() =>
    parseOnSale(searchParams.get("onSale")),
  );
  const [sort, setSort] = useState<CatalogSort>(() =>
    parseCatalogSort(searchParams.get("sort")),
  );
  const [searchQuery, setSearchQuery] = useState(
    () => searchParams.get("q")?.trim() ?? "",
  );
  const [page, setPage] = useState(() =>
    Number(searchParams.get("page") ?? "0"),
  );
  const [totalRecords, setTotalRecords] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [priceBounds, setPriceBounds] = useState<CatalogPriceBounds | null>(null);
  const [selectedPriceRange, setSelectedPriceRange] = useState<PriceRange | null>(
    null,
  );
  const [boundsReady, setBoundsReady] = useState(false);

  const isPromoView = onSaleOnly && !searchQuery;

  const priceFilterActive = useMemo(
    () =>
      priceBounds != null && selectedPriceRange != null
        ? isPriceFilterActive(selectedPriceRange, priceBounds)
        : false,
    [priceBounds, selectedPriceRange],
  );

  const syncUrl = useCallback(
    (
      nextPage: number,
      categoryIds: number[],
      deliveryTypes: DeliveryType[],
      platforms: Platform[],
      itemConditions: ItemCondition[],
      query: string,
      onSale: boolean,
      priceRange: PriceRange | null,
      bounds: CatalogPriceBounds | null,
      nextSort: CatalogSort,
    ) => {
      const params = new URLSearchParams();
      if (nextPage > 0) params.set("page", String(nextPage));
      if (categoryIds.length > 0) params.set("categories", categoryIds.join(","));
      if (deliveryTypes.length > 0) params.set("delivery", deliveryTypes.join(","));
      if (platforms.length > 0) params.set("platforms", platforms.join(","));
      if (itemConditions.length > 0) {
        params.set("conditions", itemConditions.join(","));
      }
      if (onSale) {
        params.set("onSale", "true");
      }
      if (
        priceRange != null &&
        bounds != null &&
        isPriceFilterActive(priceRange, bounds)
      ) {
        params.set("minPrice", String(priceRange[0]));
        params.set("maxPrice", String(priceRange[1]));
      }
      if (nextSort !== DEFAULT_CATALOG_SORT) {
        params.set("sort", nextSort);
      }
      if (query.trim()) {
        params.set("q", query.trim());
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
      query: string,
      onSale: boolean,
      priceRange: PriceRange | null,
      bounds: CatalogPriceBounds | null,
      nextSort: CatalogSort,
    ) => {
      setIsLoading(true);
      setErrorMessage(null);

      const applyPriceFilter =
        priceRange != null &&
        bounds != null &&
        isPriceFilterActive(priceRange, bounds);

      const response = await ProductService.findCatalog({
        page: pageIndex,
        size: PAGE_SIZE,
        categoryIds: categoryIds.length > 0 ? categoryIds : undefined,
        deliveryTypes: deliveryTypes.length > 0 ? deliveryTypes : undefined,
        platforms: platforms.length > 0 ? platforms : undefined,
        itemConditions: itemConditions.length > 0 ? itemConditions : undefined,
        q: query.trim() || undefined,
        onSale: onSale || undefined,
        minPrice: applyPriceFilter ? priceRange[0] : undefined,
        maxPrice: applyPriceFilter ? priceRange[1] : undefined,
        sort: nextSort,
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
    const loadPriceBounds = async () => {
      const response = await ProductService.getCatalogPriceBounds();
      const bounds = response.success
        ? parseCatalogPriceBounds(response.data)
        : FALLBACK_PRICE_BOUNDS;

      setPriceBounds(bounds);
      setSelectedPriceRange(
        buildPriceRangeFromUrl(
          searchParams.get("minPrice"),
          searchParams.get("maxPrice"),
          bounds,
        ),
      );
      setBoundsReady(true);
    };

    loadPriceBounds();
  }, []);

  useEffect(() => {
    const nextCategories = parseIds(searchParams.get("categories"));
    const nextDelivery = parseEnumList<DeliveryType>(searchParams.get("delivery"));
    const nextPlatforms = parseEnumList<Platform>(searchParams.get("platforms"));
    const nextConditions = parseEnumList<ItemCondition>(
      searchParams.get("conditions"),
    );
    const nextOnSale = parseOnSale(searchParams.get("onSale"));
    const nextSort = searchParams.get("sort")
      ? parseCatalogSort(searchParams.get("sort"))
      : nextOnSale
        ? "DISCOUNT_DESC"
        : DEFAULT_CATALOG_SORT;
    const nextQuery = searchParams.get("q")?.trim() ?? "";
    const urlPage = Number(searchParams.get("page") ?? "0");
    const nextPage = Number.isNaN(urlPage) || urlPage < 0 ? 0 : urlPage;

    setSelectedCategoryIds((prev) =>
      sameNumberArray(prev, nextCategories) ? prev : nextCategories,
    );
    setSelectedDeliveryTypes((prev) =>
      sameStringArray(prev, nextDelivery) ? prev : nextDelivery,
    );
    setSelectedPlatforms((prev) =>
      sameStringArray(prev, nextPlatforms) ? prev : nextPlatforms,
    );
    setSelectedConditions((prev) =>
      sameStringArray(prev, nextConditions) ? prev : nextConditions,
    );
    setOnSaleOnly((prev) => (prev === nextOnSale ? prev : nextOnSale));
    setSort((prev) => (prev === nextSort ? prev : nextSort));
    setSearchQuery((prev) => (prev === nextQuery ? prev : nextQuery));
    setPage((prev) => (prev === nextPage ? prev : nextPage));

    if (priceBounds != null) {
      const nextPriceRange = buildPriceRangeFromUrl(
        searchParams.get("minPrice"),
        searchParams.get("maxPrice"),
        priceBounds,
      );
      setSelectedPriceRange((prev) =>
        prev != null &&
        prev[0] === nextPriceRange[0] &&
        prev[1] === nextPriceRange[1]
          ? prev
          : nextPriceRange,
      );
    }
  }, [searchParams, priceBounds]);

  useEffect(() => {
    if (!boundsReady || selectedPriceRange == null) {
      return;
    }

    loadCatalog(
      page,
      selectedCategoryIds,
      selectedDeliveryTypes,
      selectedPlatforms,
      selectedConditions,
      searchQuery,
      onSaleOnly,
      selectedPriceRange,
      priceBounds,
      sort,
    );
    syncUrl(
      page,
      selectedCategoryIds,
      selectedDeliveryTypes,
      selectedPlatforms,
      selectedConditions,
      searchQuery,
      onSaleOnly,
      selectedPriceRange,
      priceBounds,
      sort,
    );
  }, [
    boundsReady,
    page,
    selectedCategoryIds,
    selectedDeliveryTypes,
    selectedPlatforms,
    selectedConditions,
    searchQuery,
    onSaleOnly,
    selectedPriceRange,
    priceBounds,
    sort,
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

  const toggleOnSale = (checked: boolean) => {
    setOnSaleOnly(checked);
    if (checked && sort === DEFAULT_CATALOG_SORT) {
      setSort("DISCOUNT_DESC");
    }
    resetPage();
  };

  const onPriceRangeChange = (range: PriceRange) => {
    if (priceBounds == null) {
      return;
    }
    setSelectedPriceRange(normalizePriceRange(range, priceBounds));
    resetPage();
  };

  const clearFilters = () => {
    setSelectedCategoryIds([]);
    setSelectedDeliveryTypes([]);
    setSelectedPlatforms([]);
    setSelectedConditions([]);
    setOnSaleOnly(false);
    setSort(DEFAULT_CATALOG_SORT);
    setSearchQuery("");
    if (priceBounds != null) {
      setSelectedPriceRange([priceBounds.min, priceBounds.max]);
    }
    resetPage();
  };

  const hasActiveFilters =
    selectedCategoryIds.length > 0 ||
    selectedDeliveryTypes.length > 0 ||
    selectedPlatforms.length > 0 ||
    selectedConditions.length > 0 ||
    onSaleOnly ||
    priceFilterActive ||
    searchQuery.length > 0;

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setPage(event.page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSortChange = (nextSort: CatalogSort) => {
    setSort(nextSort);
    resetPage();
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

    const searchLabel =
      searchQuery.length > 0 ? [`Busca: “${searchQuery}”`] : [];

    const promoLabel = onSaleOnly ? ["Promoções"] : [];
    const priceLabel =
      priceFilterActive && selectedPriceRange
        ? [
            `Preço: ${formatCurrency(selectedPriceRange[0])} – ${formatCurrency(selectedPriceRange[1])}`,
          ]
        : [];
    const sortLabel =
      sort !== DEFAULT_CATALOG_SORT
        ? [`Ordenação: ${getCatalogSortLabel(sort)}`]
        : [];

    return [
      ...promoLabel,
      ...searchLabel,
      ...priceLabel,
      ...categoryLabels,
      ...deliveryLabels,
      ...platformLabels,
      ...conditionLabels,
      ...sortLabel,
    ];
  }, [
    categories,
    selectedCategoryIds,
    selectedDeliveryTypes,
    selectedPlatforms,
    selectedConditions,
    searchQuery,
    onSaleOnly,
    priceFilterActive,
    selectedPriceRange,
    sort,
  ]);

  return (
    <div className="page-container">
      <main className="catalog-page">
        <PageBreadcrumb
          segments={breadcrumbTrail.map((label) => ({ label }))}
        />

        <header className="catalog-header">
          <div>
            <h1>{isPromoView ? "Promoções" : "Catálogo de produtos"}</h1>
            <p className="catalog-subtitle">
              {isPromoView
                ? "Ofertas com desconto ativo — combine com departamento, plataforma e ordenação."
                : "Filtre por departamento, faixa de preço, ofertas, entrega e plataforma. Combine livremente — só aparecem produtos com oferta compatível."}
            </p>
          </div>
        </header>

        <div className="catalog-layout">
          <CatalogFilters
            categories={categories}
            selectedCategoryIds={selectedCategoryIds}
            selectedDeliveryTypes={selectedDeliveryTypes}
            selectedPlatforms={selectedPlatforms}
            selectedConditions={selectedConditions}
            onSaleOnly={onSaleOnly}
            priceBounds={priceBounds}
            selectedPriceRange={selectedPriceRange}
            isPriceFilterActive={priceFilterActive}
            hasActiveFilters={hasActiveFilters}
            onToggleCategory={toggleCategory}
            onToggleDelivery={toggleDelivery}
            onTogglePlatform={togglePlatform}
            onToggleCondition={toggleCondition}
            onToggleOnSale={toggleOnSale}
            onPriceRangeChange={onPriceRangeChange}
            onClearFilters={clearFilters}
          />

          <section className="catalog-results">
            <div className="catalog-results-header">
              <span>
                {totalRecords}{" "}
                {totalRecords === 1 ? "produto encontrado" : "produtos encontrados"}
              </span>

              <div className="catalog-sort">
                <label htmlFor="catalog-sort" className="catalog-sort__label">
                  Ordenar por
                </label>
                <Dropdown
                  inputId="catalog-sort"
                  value={sort}
                  options={CATALOG_SORT_OPTIONS}
                  optionLabel="label"
                  optionValue="value"
                  onChange={(event) => onSortChange(event.value as CatalogSort)}
                  className="catalog-sort__dropdown"
                  panelClassName="catalog-sort__panel"
                />
              </div>
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
