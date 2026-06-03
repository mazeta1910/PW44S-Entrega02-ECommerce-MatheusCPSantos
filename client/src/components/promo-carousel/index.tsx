import type { IProduct } from "@/commons/types";
import { ProductCard } from "@/components/product-card";
import { Carousel } from "primereact/carousel";
import "./styles.css";

interface PromoCarouselProps {
  products: IProduct[];
}

const RESPONSIVE_OPTIONS = [
  { breakpoint: "1199px", numVisible: 4, numScroll: 1 },
  { breakpoint: "991px", numVisible: 3, numScroll: 1 },
  { breakpoint: "767px", numVisible: 2, numScroll: 1 },
  { breakpoint: "575px", numVisible: 1, numScroll: 1 },
];

export function PromoCarousel({ products }: PromoCarouselProps) {
  const itemTemplate = (product: IProduct) => (
    <div className="promo-carousel__item">
      <ProductCard product={product} />
    </div>
  );

  return (
    <Carousel
      className="promo-carousel"
      value={products}
      numVisible={5}
      numScroll={1}
      responsiveOptions={RESPONSIVE_OPTIONS}
      itemTemplate={itemTemplate}
      circular={products.length > 5}
      autoplayInterval={6000}
      showIndicators={products.length > 5}
      showNavigators={products.length > 1}
    />
  );
}
