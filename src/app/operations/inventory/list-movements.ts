import { DestroyRef, computed, inject, resource, signal, type Signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Resources } from "../../constants";
import { EmptyMovementsState, type ListState, type StockMovement } from "../../entities";
import { InventoryApi } from "../../services";

/** El libro sí se pagina en el servidor: un producto puede tener miles de asientos. */
export function listMovements(productId: Signal<number>) {
  const api = inject(InventoryApi);
  const queryClient = inject(QueryClient);
  const destroyRef = inject(DestroyRef);
  const page = signal(1);
  const ref = resource<ListState<StockMovement>, { id: number; page: number }>({
    params: () => ({ id: productId(), page: page() }),
    loader: ({ params }) => api.movements(params.id, params.page),
    defaultValue: EmptyMovementsState,
  });
  destroyRef.onDestroy(queryClient.register(Resources.MOVEMENTS, ref));
  const data = computed(() => (ref.status() === "error" ? EmptyMovementsState : ref.value()));
  const pages = computed(() => Math.max(1, data().pages));
  return {
    ref, page, pages, items: computed(() => data().items), isLoading: ref.isLoading, isError: computed(() => ref.error() != null),
    previous: () => page.update((value) => Math.max(1, value - 1)),
    next: () => page.update((value) => Math.min(pages(), value + 1)),
  };
}
