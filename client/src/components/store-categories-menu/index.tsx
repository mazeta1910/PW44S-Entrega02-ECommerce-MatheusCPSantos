import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { ICategory } from "@/commons/types";
import { getCategoryIconClass } from "@/constants/category-icons";
import CategoryService from "@/services/category-service";
import "./styles.css";

const HOVER_CLOSE_DELAY_MS = 200;
const SCROLL_STEP_PX = 140;
const SCROLL_BTN_MIN_ITEMS = 4;

type StoreCategory = { id: number; name: string };

function parseCategories(data: unknown): StoreCategory[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => {
      const raw = item as ICategory & { categoryId?: number };
      const id = raw.id ?? raw.categoryId;
      if (id == null || !raw.name) {
        return null;
      }
      return { id: Number(id), name: raw.name };
    })
    .filter((item): item is StoreCategory => item != null);
}

export function StoreCategoriesMenu() {
  const [categories, setCategories] = useState<StoreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      const response = await CategoryService.findAll();
      if (response.success) {
        setCategories(parseCategories(response.data));
      } else {
        setCategories([]);
      }
      setLoading(false);
    };
    loadCategories();
  }, []);

  const updateScrollHint = useCallback(() => {
    const element = listRef.current;
    if (!element) {
      setCanScrollDown(false);
      return;
    }
    const hasOverflow = element.scrollHeight > element.clientHeight + 2;
    const notAtBottom =
      element.scrollTop + element.clientHeight < element.scrollHeight - 2;
    setCanScrollDown(hasOverflow && notAtBottom);
  }, []);

  useEffect(() => {
    if (!open || loading) {
      return;
    }

    const element = listRef.current;
    if (!element) {
      return;
    }

    const runMeasure = () => {
      window.requestAnimationFrame(updateScrollHint);
    };

    runMeasure();
    element.addEventListener("scroll", updateScrollHint);
    window.addEventListener("resize", updateScrollHint);

    const observer = new ResizeObserver(runMeasure);
    observer.observe(element);

    return () => {
      element.removeEventListener("scroll", updateScrollHint);
      window.removeEventListener("resize", updateScrollHint);
      observer.disconnect();
    };
  }, [open, loading, categories.length, updateScrollHint]);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openPanel = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setOpen(false);
    }, HOVER_CLOSE_DELAY_MS);
  }, [clearCloseTimer]);

  const closePanel = useCallback(() => {
    clearCloseTimer();
    setOpen(false);
  }, [clearCloseTimer]);

  const scrollListDown = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    clearCloseTimer();
    listRef.current?.scrollBy({ top: SCROLL_STEP_PX, behavior: "smooth" });
    window.setTimeout(updateScrollHint, 350);
  };

  const showScrollButton =
    !loading && categories.length >= SCROLL_BTN_MIN_ITEMS;

  return (
    <div
      className="store-categories-menu"
      onMouseEnter={openPanel}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        className="store-categories-trigger top-menu-nav-link"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <span className="pi pi-tags top-menu-nav-icon" aria-hidden />
        <span>Categorias</span>
        <span className="pi pi-angle-down store-categories-chevron" aria-hidden />
      </button>

      {open && (
        <div
          className="store-categories-panel"
          role="menu"
          onMouseEnter={openPanel}
          onMouseLeave={scheduleClose}
          onMouseDown={clearCloseTimer}
        >
          <p className="store-categories-panel-title">Departamentos</p>

          {loading ? (
            <p className="store-categories-message">Carregando categorias...</p>
          ) : categories.length === 0 ? (
            <p className="store-categories-message">Nenhuma categoria disponível.</p>
          ) : (
            <>
              <div
                ref={listRef}
                className="store-categories-scroll"
                role="presentation"
              >
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/catalog?categories=${category.id}`}
                    className="store-categories-item"
                    role="menuitem"
                    onClick={closePanel}
                    onMouseDown={(event) => event.stopPropagation()}
                  >
                    <i
                      className={`store-categories-item-icon ${getCategoryIconClass(category.name)}`}
                      aria-hidden
                    />
                    <span className="store-categories-item-label">
                      {category.name}
                    </span>
                    <span className="pi pi-angle-right store-categories-item-arrow" />
                  </Link>
                ))}
              </div>

              {showScrollButton && (
                <button
                  type="button"
                  className="store-categories-scroll-btn"
                  disabled={!canScrollDown}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={scrollListDown}
                >
                  <span className="pi pi-chevron-down" aria-hidden />
                  {canScrollDown ? "Descer lista" : "Fim da lista"}
                </button>
              )}
            </>
          )}

          <div className="store-categories-footer">
            <Link
              to="/catalog"
              className="store-categories-catalog-link"
              onClick={closePanel}
              onMouseDown={(event) => event.stopPropagation()}
            >
              Ver catálogo completo
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
