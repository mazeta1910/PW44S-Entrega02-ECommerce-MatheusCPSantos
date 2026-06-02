import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Hero from "../../components/Hero"; // <--- Importando seu novo Hero
import ProductCard from "../../components/ProductCard"; // <--- Importando o Card
import "./styles.css";

export default function Home() {

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    fetch("/produtos/produtos.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Não foi possível buscar os produtos:", error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="page-container">
      <Header />

      <main className="home-page">
        {/* 1. O Hero agora é apenas uma tag simples! */}
        <Hero />

        {/* 2. Seção Mais Vendidas usando ProductCard */}
        <section className="featured-section">
          <h2>Mais Vendidas</h2>
          {isLoading ? (
            <div className="loading-message">Carregando produtos...</div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </section>

        {/* 3. Seções Estáticas (Personalize, Categorias) */}
        <div className="bottom-sections-container">
          <section className="personalize-section">
            <div className="personalize-content">
              <h2>PERSONALIZE SUA CAMISA</h2>
              <p>
                Adicione seu nome e número favorito na camisa dos seus sonhos
              </p>
              <div className="personalize-buttons">
                <Link to="/" className="btn-personalize">
                  Personalizar Agora
                </Link>
                <Link to="/" className="btn-know-more">
                  Saiba Mais
                </Link>
              </div>
            </div>
          </section>

          <section className="categories-section">
            <h2>Categorias</h2>
            <div className="categories-grid">
              <Link to="/" className="category-card">
                <div className="category-image">
                  <img
                    src="/categorias/exclusivas.jpg"
                    alt="Camisetas Exclusivas"
                  />
                </div>
                <h3>Camisetas Exclusivas</h3>
              </Link>
              <Link to="/" className="category-card">
                <div className="category-image">
                  <img src="/categorias/nacionais.jpg" alt="Clubes" />
                </div>
                <h3>Camisetas Nacionais</h3>
              </Link>
              <Link to="/" className="category-card">
                <div className="category-image">
                  <img src="/categorias/clubes-nacionais.jpg" alt="Seleções" />
                </div>
                <h3>Clubes Nacionais</h3>
              </Link>
              <Link to="/" className="category-card">
                <div className="category-image">
                  <img src="/categorias/clubes-europeus.jpg" alt="Acessórios" />
                </div>
                <h3>Clubes Europeus</h3>
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}