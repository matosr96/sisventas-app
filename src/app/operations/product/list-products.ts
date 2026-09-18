import { computed, inject } from "@angular/core";
import { Resources } from "../../constants";
import { EmptyProductsState, type Product } from "../../entities";
import { ProductsApi } from "../../services";
import { filterableList, listResource, safeValue } from "../list-resource";

/** Listado con búsqueda y chips derivados en el render: se guarda el término y los filtros, no la lista. */
export function listProducts(matches: (item: Product, term: string) => boolean) {
  const api = inject(ProductsApi);
  const ref = listResource(Resources.PRODUCTS, () => api.list(), EmptyProductsState);
  const data = safeValue(ref, EmptyProductsState);
  const items = computed(() => data().items);
  const search = filterableList(items, matches);
  return { ref, items, ...search, isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
