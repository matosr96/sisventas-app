import { computed, inject } from "@angular/core";
import { Resources } from "../../constants";
import { EmptySummaryState } from "../../entities";
import { ReportsApi } from "../../services";
import { listResource, safeValue } from "../list-resource";

/** Variación porcentual redondeada; null cuando no hay base con la que comparar. */
const deltaPercent = (current: number, previous: number): number | null =>
  previous === 0 ? null : Math.round(((current - previous) / previous) * 100);

/** Cifras de Inicio tal como las agrega la API: no dependen de cuántas ventas quepan en una página. */
export function homeSummary() {
  // inject() solo vale aquí, en el contexto de inyección; nunca dentro de un loader.
  const api = inject(ReportsApi);
  const ref = listResource(Resources.REPORTS, () => api.summary(), EmptySummaryState);
  const summary = safeValue(ref, EmptySummaryState);
  return {
    summary,
    isLoading: ref.isLoading,
    isError: computed(() => ref.error() != null),
    todayDelta: computed(() => deltaPercent(summary().todayTotal, summary().yesterdayTotal)),
  };
}
