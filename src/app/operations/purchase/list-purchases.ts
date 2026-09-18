import { computed, inject } from "@angular/core";
import { Resources } from "../../constants";
import { EmptyPurchasesState } from "../../entities";
import { PurchasesApi } from "../../services";
import { filterableList, listResource, safeValue } from "../list-resource";

/** Listado con búsqueda y chips derivados en el render: se guarda el término y los filtros, no la lista. */
export function listPurchases() {
  const api = inject(PurchasesApi);
  const ref = listResource(Resources.PURCHASES, () => api.list(), EmptyPurchasesState);
  const data = safeValue(ref, EmptyPurchasesState);
  const items = computed(() => data().items);
  const search = filterableList(items, (purchase, term) => [purchase.purchaseNumber, purchase.supplierName].join(" ").toLowerCase().includes(term));
  return { ref, items, ...search, isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
