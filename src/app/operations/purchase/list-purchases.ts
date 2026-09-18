import { computed, inject, signal } from "@angular/core";
import { Resources } from "../../constants";
import { EmptyPurchasesState } from "../../entities";
import { PurchasesApi } from "../../services";
import { listResource, safeValue } from "../list-resource";

export function listPurchases() {
  const api = inject(PurchasesApi);
  const ref = listResource(Resources.PURCHASES, () => api.list(), EmptyPurchasesState);
  const data = safeValue(ref, EmptyPurchasesState);
  const searchTerm = signal("");
  const items = computed(() => data().items);
  const filtered = computed(() => {
    const term = searchTerm().trim().toLowerCase();
    return term
      ? items().filter((purchase) => [purchase.purchaseNumber, purchase.supplierName].join(" ").toLowerCase().includes(term))
      : items();
  });
  return { ref, items, filtered, searchTerm, isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
