import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AutoComplete,
} from "primereact/autocomplete";
import type { IPage, IProduct } from "@/commons/types";
import ProductService from "@/services/product-service";
import { getProductImageUrl } from "@/utils/image-utils";
import "./styles.css";

const SUGGESTION_LIMIT = 8;
const MIN_QUERY_LENGTH = 1;

export function ProductSearchBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<IProduct[]>([]);

  useEffect(() => {
    if (location.pathname === "/catalog") {
      const params = new URLSearchParams(location.search);
      setQuery(params.get("q") ?? "");
      return;
    }

    setQuery("");
    setSuggestions([]);
  }, [location.pathname, location.search]);

  const fetchSuggestions = useCallback(async (term: string) => {
    const trimmed = term.trim();

    if (trimmed.length < MIN_QUERY_LENGTH) {
      setSuggestions([]);
      return;
    }

    const response = await ProductService.findCatalog({
      q: trimmed,
      page: 0,
      size: SUGGESTION_LIMIT,
    });

    if (response.success && response.data) {
      const pageData = response.data as IPage<IProduct>;
      setSuggestions(pageData.content ?? []);
      return;
    }

    setSuggestions([]);
  }, []);

  const handleComplete = (event: { query: string }) => {
    void fetchSuggestions(event.query);
  };

  const handleChange = (value: string) => {
    setQuery(value);
  };

  const handleSelect = (event: { value: IProduct }) => {
    const product = event.value;

    if (product?.id) {
      navigate(`/catalog/product/${product.id}`);
    }
  };

  const navigateToSearchResults = (term: string) => {
    const trimmed = term.trim();

    if (trimmed) {
      navigate(`/catalog?q=${encodeURIComponent(trimmed)}`);
      return;
    }

    navigate("/catalog");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    navigateToSearchResults(query);
  };

  const itemTemplate = (product: IProduct) => (
    <div className="top-menu-search__suggestion">
      <img
        src={getProductImageUrl(product.image)}
        alt=""
        className="top-menu-search__suggestion-image"
        loading="lazy"
      />
      <span className="top-menu-search__suggestion-name">{product.name}</span>
    </div>
  );

  return (
    <form
      className="top-menu-search"
      role="search"
      aria-label="Buscar produtos"
      onSubmit={handleSubmit}
    >
      <div className="top-menu-search__field">
        <i className="pi pi-search top-menu-search__icon" aria-hidden />
        <AutoComplete
          value={query}
          suggestions={suggestions}
          completeMethod={handleComplete}
          onChange={(event) => handleChange(String(event.value ?? ""))}
          onSelect={handleSelect}
          field="name"
          placeholder="Busque aqui o seu produto"
          delay={300}
          minLength={MIN_QUERY_LENGTH}
          forceSelection={false}
          itemTemplate={itemTemplate}
          emptyMessage="Nenhum produto encontrado"
          className="top-menu-search__autocomplete"
          inputClassName="top-menu-search__input w-full"
          panelClassName="top-menu-search__panel"
          appendTo={
            typeof document !== "undefined" ? document.body : undefined
          }
          aria-label="Termo de busca"
        />
      </div>
    </form>
  );
}
