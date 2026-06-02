import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";
import type { ICategory, IProduct } from "@/commons/types";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import CategoryService from "@/services/category-service";
import ProductService from "@/services/product-service";
import "./styles.css";

const CATEGORY_ICONS: Record<string, string> = {
  Periféricos: "🎮",
  Jogos: "🕹️",
  "PC e Hardware": "💻",
  Monitores: "🖥️",
  Cadeiras: "🪑",
  Consoles: "🎯",
  "Serviços e Conectividade": "📡",
};

function getCategoryIcon(name: string): string {
  return CATEGORY_ICONS[name] ?? "📦";
}

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

  const featuredProducts = useMemo(
    () => products.slice(0, 4),
    [products],
  );

  return (
    <div className="page-container">
      <main className="home-page">
        <Hero />

        <section id="produtos" className="featured-section">
          <h2>
            {selectedCategoryName
              ? `Produtos — ${selectedCategoryName}`
              : "Destaques"}
          </h2>
          <p className="section-subtitle">
            {selectedCategoryName
              ? "Produtos filtrados pela categoria selecionada"
              : "Uma seleção das melhores ofertas — veja o catálogo completo para mais"}
          </p>

          <div className="filter-actions">
            <Link to="/catalog">
              <Button label="Ver catálogo completo" icon="pi pi-arrow-right" />
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
              Nenhum produto encontrado nesta categoria.
            </div>
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
                    <span className="category-icon" aria-hidden>
                      {getCategoryIcon(category.name)}
                    </span>
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
