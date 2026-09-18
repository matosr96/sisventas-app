import { computed, inject, signal } from "@angular/core";
import { Resources } from "../../constants";
import { EmptySuppliersState, type Supplier } from "../../entities";
import { SuppliersApi } from "../../services";
import { listResource, safeValue } from "../list-resource";

/** Listado con búsqueda derivada en el render: el término se guarda, el filtro no. */
export function listSuppliers(matches: (item: Supplier, term: string) => boolean) {
  const api = inject(SuppliersApi);
  const ref = listResource(Resources.SUPPLIERS, () => api.list(), EmptySuppliersState);
  const data = safeValue(ref, EmptySuppliersState);
  const searchTerm = signal("");
  const items = computed(() => data().items);
  const filtered = computed(() => {
    const term = searchTerm().trim().toLowerCase();
    return term ? items().filter((item) => matches(item, term)) : items();
  });
  return { ref, items, filtered, searchTerm, isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
