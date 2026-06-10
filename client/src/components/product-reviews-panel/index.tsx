import { Rating } from "primereact/rating";
import type { IProduct } from "@/commons/types";
import "./styles.css";

interface ProductReviewsPanelProps {
  product: IProduct;
}

function estimateDistribution(average: number, total: number): number[] {
  if (total <= 0) {
    return [0, 0, 0, 0, 0];
  }

  const weights = [5, 4, 3, 2, 1].map((star) => {
    const diff = Math.abs(star - average);
    return Math.max(0.05, 1.1 - diff * 0.45);
  });
  const weightSum = weights.reduce((sum, value) => sum + value, 0);

  const distribution = weights.map((weight) =>
    Math.round((weight / weightSum) * total),
  );
  const distributionSum = distribution.reduce((sum, value) => sum + value, 0);
  const delta = total - distributionSum;

  if (delta !== 0) {
    const peakIndex = average >= 4.5 ? 0 : average >= 3.5 ? 1 : 2;
    distribution[peakIndex] = Math.max(0, distribution[peakIndex] + delta);
  }

  return distribution;
}

export function ProductReviewsPanel({ product }: ProductReviewsPanelProps) {
  const rating = product.averageRating ?? 0;
  const count = product.reviewCount ?? 0;
  const hasReviews = rating > 0 || count > 0;
  const distribution = estimateDistribution(rating, count);
  const maxBucket = Math.max(...distribution, 1);

  return (
    <div className="product-reviews-panel">
      <div className="product-reviews-panel__summary">
        <div className="product-reviews-panel__score-block">
          <span className="product-reviews-panel__score-value">
            {hasReviews ? rating.toFixed(1) : "—"}
          </span>
          <Rating
            value={hasReviews ? rating : 0}
            readOnly
            cancel={false}
            className="product-reviews-panel__stars"
          />
          <span className="product-reviews-panel__score-caption">
            {hasReviews
              ? `${count} ${count === 1 ? "avaliação" : "avaliações"}`
              : "Sem avaliações ainda"}
          </span>
        </div>

        {hasReviews && (
          <div className="product-reviews-panel__bars" aria-hidden>
            {distribution.map((bucketCount, index) => {
              const stars = 5 - index;
              const width = `${Math.round((bucketCount / maxBucket) * 100)}%`;

              return (
                <div key={stars} className="product-reviews-panel__bar-row">
                  <span className="product-reviews-panel__bar-label">{stars}</span>
                  <div className="product-reviews-panel__bar-track">
                    <span
                      className="product-reviews-panel__bar-fill"
                      style={{ width }}
                    />
                  </div>
                  <span className="product-reviews-panel__bar-count">
                    {bucketCount}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="product-reviews-panel__comments">
        <h3 className="product-reviews-panel__comments-title">
          <i className="pi pi-comments" aria-hidden />
          Comentários dos clientes
        </h3>

        {hasReviews ? (
          <p className="product-reviews-panel__comments-note">
            A nota média reflete o conjunto de {count}{" "}
            {count === 1 ? "avaliação" : "avaliações"} deste produto. Os
            comentários individuais serão exibidos aqui em breve.
          </p>
        ) : (
          <div className="product-reviews-panel__empty">
            <i className="pi pi-inbox" aria-hidden />
            <p>Ninguém comentou ainda.</p>
            <span>Seja o primeiro a avaliar depois da compra.</span>
          </div>
        )}
      </div>
    </div>
  );
}
