import { DestroyRef, computed, inject, resource, signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Resources } from "../../constants";
import { EmptyCashClosingState, type CashClosing } from "../../entities";
import { ReportsApi } from "../../services";
import { safeValue } from "../list-resource";

const today = (): string => new Date().toISOString().slice(0, 10);

/** Cierre de caja de un día, opcionalmente de un solo vendedor. */
export function cashClosing() {
  const api = inject(ReportsApi);
  const queryClient = inject(QueryClient);
  const destroyRef = inject(DestroyRef);
  const date = signal<string>(today());
  const userId = signal<number | null>(null);
  const ref = resource<CashClosing, { date: string; userId: number | null }>({
    params: () => ({ date: date(), userId: userId() }),
    loader: ({ params }) => api.closing(params.date, params.userId),
    defaultValue: EmptyCashClosingState,
  });
  destroyRef.onDestroy(queryClient.register(Resources.REPORTS, ref));
  return { date, userId, closing: safeValue(ref, EmptyCashClosingState), isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
