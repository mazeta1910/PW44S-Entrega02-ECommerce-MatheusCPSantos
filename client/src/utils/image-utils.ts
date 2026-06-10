export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

export const PLACEHOLDER_PRODUCT_IMAGE =
  "https://primefaces.org/cdn/primereact/images/product/blue-band.jpg";

/**
 * Converte o caminho salvo no produto em URL absoluta.
 * Caminhos relativos (/images/...) são servidos pelo Spring em static/images.
 */
export function getProductImageUrl(image?: string | null): string {
  if (!image?.trim()) {
    return PLACEHOLDER_PRODUCT_IMAGE;
  }

  const trimmed = image.trim();

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `${API_BASE_URL}${trimmed}`;
  }

  return `${API_BASE_URL}/images/${trimmed}`;
}
