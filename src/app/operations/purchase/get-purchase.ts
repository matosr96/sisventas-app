import { DestroyRef, computed, inject, resource, type Signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Resources } from "../../constants";
import type { Purchase } from "../../entities";
import { PurchasesApi } from "../../services";

export function getPurchase(id: Signal<number>) {
  const api = inject(PurchasesApi);
  const queryClient = inject(QueryClient);
  const destroyRef = inject(DestroyRef);
  const ref = resource<Purchase | null, number>({ params: () => id(), loader: ({ params }) => api.get(params), defaultValue: null });
  destroyRef.onDestroy(queryClient.register(Resources.PURCHASES, ref));
  const purchase = computed(() => (ref.status() === "error" ? null : ref.value()));
  return { ref, purchase, isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
