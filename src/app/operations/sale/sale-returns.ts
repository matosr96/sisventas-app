import { DestroyRef, computed, inject, resource, signal, type Signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { Resources } from "../../constants";
import type { Sale, SaleReturn } from "../../entities";
import { SalesApi } from "../../services";
import { apiErrorMessage } from "../../utils";

/** Devoluciones de una venta, y el formulario para registrar una nueva línea a línea. */
export function saleReturns(saleId: Signal<number>) {
  const api = inject(SalesApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const destroyRef = inject(DestroyRef);

  const ref = resource<SaleReturn[], number>({ params: () => saleId(), loader: ({ params }) => api.returns(params), defaultValue: [] });
  destroyRef.onDestroy(queryClient.register(Resources.RETURNS, ref));
  const items = computed(() => (ref.status() === "error" ? [] : ref.value()));
  const returnedTotal = computed(() => items().reduce((sum, item) => sum + item.total, 0));

  /** Cantidad a devolver por línea vendida; solo se envían las > 0. */
  const quantities = signal<Record<number, number>>({});
  const reason = signal("");
  const pending = signal(false);
  const setQuantity = (saleItemId: number, quantity: number | null, max: number): void =>
    quantities.update((current) => ({ ...current, [saleItemId]: Math.max(0, Math.min(max, quantity ?? 0)) }));
  const requested = computed(() => Object.entries(quantities()).filter(([, q]) => q > 0).map(([id, q]) => ({ saleItemId: Number(id), quantity: q })));
  const requestedTotal = (sale: Sale): number =>
    requested().reduce((sum, line) => sum + (sale.items.find((item) => item.id === line.saleItemId)?.unitPrice ?? 0) * line.quantity, 0);
  const reset = (): void => { quantities.set({}); reason.set(""); };

  const submit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    if (pending()) return false;
    if (requested().length === 0) { toast.error("Indica cuántas unidades devuelves de al menos una línea."); return false; }
    if (!reason().trim()) { toast.error("Escribe el motivo de la devolución."); return false; }
    pending.set(true);
    try {
      const created = await api.createReturn(saleId(), { reason: reason().trim(), items: requested() });
      queryClient.invalidate(Resources.RETURNS, Resources.SALES, Resources.PRODUCTS, Resources.REPORTS);
      toast.success(`Devolución ${created.returnNumber} registrada; el stock ya volvió.`);
      reset();
      return true;
    } catch (error) {
      toast.error(apiErrorMessage(error));
      return false;
    } finally {
      pending.set(false);
    }
  };

  return { items, returnedTotal, isLoading: ref.isLoading, quantities, setQuantity, reason, requested, requestedTotal, pending, submit, reset };
}
