import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import type { ICategory, IProduct } from "@/commons/types";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { PromoCarousel } from "@/components/promo-carousel";
import CategoryService from "@/services/category-service";
import ProductService from "@/services/product-service";
import { getCategoryIconClass } from "@/constants/category-icons";
import { getPromoProducts } from "@/utils/product-utils";
import "./styles.css";

export function HomePage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadProducts = useCallback(async (categoryId: number | null) => {
    setIsLoading(true);
    setErrorMessage(null);

    const response =
      categoryId !== null
        ? await ProductService.findByCategory(categoryId)
        : await ProductService.findAll();

    if (response.success && Array.isArray(response.data)) {
      setProducts(response.data as IProduct[]);
    } else {
      setProducts([]);
      setErrorMessage(
        response.message ??
          "Não foi possível carregar os produtos. Verifique se o servidor está em execução.",
      );
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      const response = await CategoryService.findAll();
      if (response.success && Array.isArray(response.data)) {
        setCategories(response.data as ICategory[]);
      }
    };

    loadCategories();
    loadProducts(null);
  }, [loadProducts]);

  useEffect(() => {
    if (window.location.hash === "#produtos") {
      document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [isLoading]);

  const handleCategorySelect = (categoryId: number) => {
    setSelectedCategoryId(categoryId);
    loadProducts(categoryId);
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleShowAll = () => {
    setSelectedCategoryId(null);
    loadProducts(null);
  };

  const selectedCategoryName = categories.find(
    (c) => c.id === selectedCategoryId,
  )?.name;

  const promoProducts = useMemo(
    () => getPromoProducts(products),
    [products],
  );

  const featuredProducts = useMemo(() => {
    if (selectedCategoryId !== null) {
      return products.slice(0, 8);
    }
    return promoProducts.length > 0 ? promoProducts : products.slice(0, 8);
  }, [products, selectedCategoryId, promoProducts]);

  const isPromoSection =
    selectedCategoryId === null && promoProducts.length > 0;

  return (
    <div className="page-container">
      <main className="home-page">
        <Hero />

        <section id="produtos" className="featured-section">
          <h2>
            {selectedCategoryName
              ? `Produtos — ${selectedCategoryName}`
              : isPromoSection
                ? "Promoções"
                : "Produtos em destaque"}
          </h2>
          <p className="section-subtitle">
            {selectedCategoryName
              ? "Produtos filtrados pela categoria selecionada"
              : isPromoSection
                ? "Ofertas com desconto — preços promocionais por tempo limitado"
                : "Confira alguns itens do nosso catálogo"}
          </p>

          <div className="filter-actions">
            <Link to={isPromoSection ? "/catalog?onSale=true" : "/catalog"}>
              <Button
                label={
                  isPromoSection ? "Ver todas as promoções" : "Ver catálogo completo"
                }
                size="small"
              />
            </Link>
          </div>

          {selectedCategoryId !== null && (
            <div className="filter-actions">
              <button
                type="button"
                className="filter-clear-btn"
                onClick={handleShowAll}
              >
                Ver todos os produtos
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="loading-message">Carregando produtos...</div>
          ) : errorMessage ? (
            <div className="loading-message error-message">{errorMessage}</div>
          ) : products.length === 0 ? (
            <div className="loading-message">
              Nenhum produto encontrado.
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="loading-message">
              Nenhum produto encontrado nesta categoria.
            </div>
          ) : isPromoSection ? (
            <PromoCarousel products={featuredProducts} />
          ) : (
            <div className="products-grid">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        <section className="categories-section">
          <h2>Categorias</h2>
          {categories.length === 0 ? (
            <div className="loading-message">Carregando categorias...</div>
          ) : (
            <div className="categories-grid">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={
                    category.id
                      ? `/catalog?categories=${category.id}`
                      : "/catalog"
                  }
                  className="category-card"
                >
                  <div className="category-image category-image--placeholder">
                    <i
                      className={`category-icon ${getCategoryIconClass(category.name)}`}
                      aria-hidden
                    />
                  </div>
                  <h3>{category.name}</h3>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
