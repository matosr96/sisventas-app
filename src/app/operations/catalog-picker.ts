import { computed, inject, signal, type Signal } from "@angular/core";
import { Resources } from "../constants";
import { EmptyCategoriesState, type Product } from "../entities";
import { CategoriesApi } from "../services";
import { listResource, safeValue } from "./list-resource";

/**
 * Selector de catálogo de las pantallas de venta y compra: búsqueda por SKU o nombre y chips
 * de categoría sobre la lista de productos que se le pasa. `exactMatch` resuelve un SKU tecleado
 * o leído con lector de código de barras: si coincide uno solo, se añade con Enter.
 */
export function catalogPicker(products: Signal<Product[]>) {
  const categoriesApi = inject(CategoriesApi);
  const categoriesRef = listResource(Resources.CATEGORIES, () => categoriesApi.list(), EmptyCategoriesState);
  const categories = computed(() => safeValue(categoriesRef, EmptyCategoriesState)().items);

  const searchTerm = signal("");
  const categoryId = signal<string | null>(null);

  const visible = computed(() => {
    const term = searchTerm().trim().toLowerCase();
    const category = categoryId();
    return products().filter((product) =>
      (!term || product.sku.toLowerCase().includes(term) || product.name.toLowerCase().includes(term))
      && (category === null || String(product.categoryId) === category)
    );
  });
  const exactMatch = computed<Product | null>(() => {
    const term = searchTerm().trim().toLowerCase();
    if (!term) return null;
    const bySku = products().find((product) => product.sku.toLowerCase() === term);
    if (bySku) return bySku;
    const candidates = visible();
    return candidates.length === 1 ? candidates[0] : null;
  });

  return { searchTerm, categoryId, categories, visible, exactMatch };
}
