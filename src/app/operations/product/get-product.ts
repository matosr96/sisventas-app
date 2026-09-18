import { DestroyRef, computed, inject, resource, type Signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Resources } from "../../constants";
import type { Product } from "../../entities";
import { ProductsApi } from "../../services";

export function getProduct(id: Signal<number>) {
  const api = inject(ProductsApi);
  const queryClient = inject(QueryClient);
  const destroyRef = inject(DestroyRef);
  const ref = resource<Product | null, number>({ params: () => id(), loader: ({ params }) => api.get(params), defaultValue: null });
  destroyRef.onDestroy(queryClient.register(Resources.PRODUCTS, ref));
  const product = computed(() => (ref.status() === "error" ? null : ref.value()));
  return { ref, product, isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
