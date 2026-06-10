import { Rating } from "primereact/rating";
import "./styles.css";

interface ProductRatingProps {
  averageRating?: number | null;
  reviewCount?: number | null;
  compact?: boolean;
}

export function ProductRating({
  averageRating,
  reviewCount,
  compact = false,
}: ProductRatingProps) {
  const rating = averageRating ?? 0;
  const count = reviewCount ?? 0;
  const hasReviews = rating > 0 || count > 0;

  return (
    <div
      className={`product-rating${compact ? " product-rating--compact" : ""}${
        !hasReviews ? " product-rating--empty" : ""
      }`}
      aria-label={
        hasReviews
          ? `Avaliação ${rating.toFixed(1)} de 5 estrelas, ${count} avaliações`
          : "Produto sem avaliações"
      }
    >
      <Rating value={hasReviews ? rating : 0} readOnly cancel={false} />
      {hasReviews ? (
        <>
          <span className="product-rating__score">{rating.toFixed(1)}</span>
          <span className="product-rating__count">
            ({count} {count === 1 ? "avaliação" : "avaliações"})
          </span>
        </>
      ) : (
        <span className="product-rating__count">Sem avaliações</span>
      )}
    </div>
  );
}
