import { computed, inject, signal } from "@angular/core";
import { Resources } from "../../constants";
import { EmptyProductsState, type Product } from "../../entities";
import { ProductsApi } from "../../services";
import { listResource, safeValue } from "../list-resource";

/** Listado con búsqueda derivada en el render: el término se guarda, el filtro no. */
export function listProducts(matches: (item: Product, term: string) => boolean) {
  const api = inject(ProductsApi);
  const ref = listResource(Resources.PRODUCTS, () => api.list(), EmptyProductsState);
  const data = safeValue(ref, EmptyProductsState);
  const searchTerm = signal("");
  const items = computed(() => data().items);
  const filtered = computed(() => {
    const term = searchTerm().trim().toLowerCase();
    return term ? items().filter((item) => matches(item, term)) : items();
  });
  return { ref, items, filtered, searchTerm, isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
