import { DestroyRef, computed, inject, resource, signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import type { DateRange } from "../../components/shared";
import { Resources } from "../../constants";
import { EmptySalesReportState, type SalesReport } from "../../entities";
import { ReportsApi } from "../../services";
import { safeValue } from "../list-resource";

/** Informe de ventas por rango de fechas (yyyy-MM-dd). Sin rango, la API usa los últimos 30 días. */
export function salesReport() {
  const api = inject(ReportsApi);
  const queryClient = inject(QueryClient);
  const destroyRef = inject(DestroyRef);
  const range = signal<DateRange>({ from: null, to: null });
  const ref = resource<SalesReport, DateRange>({
    params: () => range(),
    loader: ({ params }) => api.sales(params.from, params.to),
    defaultValue: EmptySalesReportState,
  });
  destroyRef.onDestroy(queryClient.register(Resources.REPORTS, ref));
  const report = safeValue(ref, EmptySalesReportState);
  return {
    range, report, isLoading: ref.isLoading, isError: computed(() => ref.error() != null),
    averageTicket: computed(() => (report().count === 0 ? 0 : report().total / report().count)),
  };
}
