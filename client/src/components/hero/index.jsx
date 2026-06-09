import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const heroBanners = [
  {
    id: 1,
    title: "SETUP GAMER COMPLETO",
    subtitle:
      "Teclados, mouses e headsets com condições especiais para montar seu cantinho.",
    link: "/catalog",
    btnText: "VER OFERTAS",
    imgUrl: "/banner-bg3.png",
  },
  {
    id: 2,
    title: "JOGOS DIGITAIS",
    subtitle: "Os lançamentos mais jogados com entrega imediata.",
    link: "/catalog",
    btnText: "EXPLORAR JOGOS",
    imgUrl: "/banner-bg1.png",
  },
  {
    id: 3,
    title: "HARDWARE DE ALTA PERFORMANCE",
    subtitle: "Placas de vídeo, monitores e periféricos para rodar tudo no ultra.",
    link: "/catalog",
    btnText: "VER PRODUTOS",
    imgUrl: "/banner-bg2.png",
  },
];

export default function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = heroBanners.length;

  // Avançar slide
  const nextSlide = () => {
    setCurrentSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
  };

  // Voltar slide
  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
  };

  // Opcional: Autoplay (passar sozinho a cada 5s)
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <section className="hero-carousel-component">
      {heroBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={
            index === currentSlide ? "hero-slide active" : "hero-slide"
          }
        >
          {/* A imagem de fundo é aplicada via style inline para ser dinâmica */}
          <div
            className="hero-bg"
            style={{ backgroundImage: `url(${banner.imgUrl})` }}
          >
            <div className="hero-overlay">
              <div className="hero-content">
                <h1>{banner.title}</h1>
                <p>{banner.subtitle}</p>
                {/* Verifica se é link externo ou interno */}
                {banner.link.startsWith("http") ? (
                  <a
                    href={banner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-hero"
                  >
                    {banner.btnText}
                  </a>
                ) : (
                  <Link to={banner.link} className="btn-hero">
                    {banner.btnText}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Setas de Navegação */}
      <button
        type="button"
        className="hero-arrow prev surface-icon-button"
        onClick={prevSlide}
        aria-label="Slide anterior"
      >
        <i className="pi pi-chevron-left" aria-hidden />
      </button>
      <button
        type="button"
        className="hero-arrow next surface-icon-button"
        onClick={nextSlide}
        aria-label="Próximo slide"
      >
        <i className="pi pi-chevron-right" aria-hidden />
      </button>

      {/* Paginação (Bolinhas) */}
      <div className="hero-pagination">
        {heroBanners.map((_, index) => (
          <div
            key={index}
            className={index === currentSlide ? "hero-dot active" : "hero-dot"}
            onClick={() => setCurrentSlide(index)}
          ></div>
        ))}
      </div>
    </section>
  );
}