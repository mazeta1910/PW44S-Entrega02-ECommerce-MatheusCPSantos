import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./styles.css";

const heroBanners = [
  {
    id: 1,
    title: "LANÇAMENTOS EXCLUSIVOS",
    subtitle:
      "Vocês sabiam que o nosso número de lançamentos de camisetas exclusivas aumentou em 16 peças e 50?",
    link: "/",
    btnText: "CONFIRA OS LANÇAMENTOS",
    imgUrl: "/logo/THDFM_logo_fundo_preto.png",
  },
  {
    id: 2,
    title: "PROMOÇÃO IMPERDÍVEL",
    subtitle: "Até 30% OFF em camisetas de clubes.",
    link: "/",
    btnText: "VER PROMOÇÕES",
    imgUrl: "/logo/THDFM_logo_fundo_preto.png",
  },
  {
    id: 3,
    title: "ACOMPANHE A THDFM",
    subtitle: "Vamos juntos construir o nosso resultado.",
    link: "https://www.facebook.com/thdfm",
    btnText: "Facebook",
    imgUrl: "/logo/THDFM_logo_fundo_preto.png",
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
      <button className="hero-arrow prev" onClick={prevSlide}>
        &lt;
      </button>
      <button className="hero-arrow next" onClick={nextSlide}>
        &gt;
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