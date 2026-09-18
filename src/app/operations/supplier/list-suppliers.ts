import { computed, inject } from "@angular/core";
import { Resources } from "../../constants";
import { EmptySuppliersState, type Supplier } from "../../entities";
import { SuppliersApi } from "../../services";
import { filterableList, listResource, safeValue } from "../list-resource";

/** Listado con búsqueda y chips derivados en el render: se guarda el término y los filtros, no la lista. */
export function listSuppliers(matches: (item: Supplier, term: string) => boolean) {
  const api = inject(SuppliersApi);
  const ref = listResource(Resources.SUPPLIERS, () => api.list(), EmptySuppliersState);
  const data = safeValue(ref, EmptySuppliersState);
  const items = computed(() => data().items);
  const search = filterableList(items, matches);
  return { ref, items, ...search, isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
