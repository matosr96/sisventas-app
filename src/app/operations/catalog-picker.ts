import { computed, effect, inject, signal, untracked, DestroyRef } from "@angular/core";
import { Resources } from "../constants";
import { EmptyCategoriesState, EmptyProductsState, EmptyQueryState, ProductStatus, type ListQuery, type Product } from "../entities";
import { CategoriesApi, ProductsApi } from "../services";
import { listResource, safeValue } from "./list-resource";

const SEARCH_DEBOUNCE_MS = 250;
const CATALOG_PAGE = 100;

/**
 * Selector de catálogo de las pantallas de venta y compra: búsqueda por SKU o nombre y chips
 * de categoría resueltos EN EL SERVIDOR (el catálogo puede tener miles de productos), con
 * retardo para no pedir por cada tecla. `exactMatch` resuelve un SKU tecleado o leído con
 * lector de código de barras: si coincide uno solo, se añade con Enter.
 */
export function catalogPicker() {
  const productsApi = inject(ProductsApi);
  const categoriesApi = inject(CategoriesApi);
  const destroyRef = inject(DestroyRef);

  const categoriesRef = listResource(Resources.CATEGORIES,
    () => categoriesApi.list({ ...EmptyQueryState, limit: CATALOG_PAGE, sort: "name", dir: "asc" }), EmptyCategoriesState);
  const categories = computed(() => safeValue(categoriesRef, EmptyCategoriesState)().items);

  const searchTerm = signal("");
  const categoryId = signal<string | null>(null);
  const query = signal<ListQuery>({
    ...EmptyQueryState, limit: CATALOG_PAGE, sort: "name", dir: "asc", filters: { status: ProductStatus.ACTIVE },
  });

  let timer: ReturnType<typeof setTimeout> | undefined;
  effect(() => {
    const search = searchTerm().trim();
    const category = categoryId();
    clearTimeout(timer);
    timer = setTimeout(() => untracked(() =>
      query.update((current) => ({ ...current, search, filters: { ...current.filters, categoryId: category } }))
    ), SEARCH_DEBOUNCE_MS);
  });
  destroyRef.onDestroy(() => clearTimeout(timer));

  const productsRef = listResource(Resources.PRODUCTS, () => productsApi.list(untracked(query)), EmptyProductsState);
  // El recurso no lee la consulta dentro del loader (inject/untracked): se recarga a mano al cambiar.
  effect(() => { query(); untracked(() => productsRef.reload()); });
  const visible = computed(() => safeValue(productsRef, EmptyProductsState)().items);

  const exactMatch = computed<Product | null>(() => {
    const term = searchTerm().trim().toLowerCase();
    if (!term) return null;
    const bySku = visible().find((product) => product.sku.toLowerCase() === term);
    if (bySku) return bySku;
    return visible().length === 1 ? visible()[0] : null;
  });

  return {
    searchTerm, categoryId, categories, visible, exactMatch,
    isLoading: computed(() => productsRef.isLoading() && visible().length === 0),
    isSearching: productsRef.isLoading,
    isError: computed(() => productsRef.error() != null),
  };
}
