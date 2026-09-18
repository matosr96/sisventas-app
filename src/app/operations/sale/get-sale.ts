import { DestroyRef, computed, inject, resource, type Signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Resources } from "../../constants";
import type { Sale } from "../../entities";
import { SalesApi } from "../../services";

export function getSale(id: Signal<number>) {
  const api = inject(SalesApi);
  const queryClient = inject(QueryClient);
  const destroyRef = inject(DestroyRef);
  const ref = resource<Sale | null, number>({ params: () => id(), loader: ({ params }) => api.get(params), defaultValue: null });
  destroyRef.onDestroy(queryClient.register(Resources.SALES, ref));
  const sale = computed(() => (ref.status() === "error" ? null : ref.value()));
  return { ref, sale, isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
