import { computed, inject } from "@angular/core";
import { Resources } from "../../constants";
import { EmptySalesState } from "../../entities";
import { SalesApi } from "../../services";
import { filterableList, listResource, safeValue } from "../list-resource";

/** Listado con búsqueda y chips derivados en el render: se guarda el término y los filtros, no la lista. */
export function listSales() {
  const api = inject(SalesApi);
  const ref = listResource(Resources.SALES, () => api.list(), EmptySalesState);
  const data = safeValue(ref, EmptySalesState);
  const items = computed(() => data().items);
  const search = filterableList(items, (sale, term) => sale.saleNumber.toLowerCase().includes(term));
  return { ref, items, ...search, isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
