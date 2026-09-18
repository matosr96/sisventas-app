import { computed, inject, signal } from "@angular/core";
import { Resources } from "../../constants";
import { EmptySalesState } from "../../entities";
import { SalesApi } from "../../services";
import { listResource, safeValue } from "../list-resource";

export function listSales() {
  const api = inject(SalesApi);
  const ref = listResource(Resources.SALES, () => api.list(), EmptySalesState);
  const data = safeValue(ref, EmptySalesState);
  const searchTerm = signal("");
  const items = computed(() => data().items);
  const filtered = computed(() => {
    const term = searchTerm().trim().toLowerCase();
    return term ? items().filter((sale) => sale.saleNumber.toLowerCase().includes(term)) : items();
  });
  return { ref, items, filtered, searchTerm, isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
