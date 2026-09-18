import { inject, signal, type Signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { Resources } from "../../constants";
import { EmptyAdjustmentState, type AdjustStockDto } from "../../entities";
import { InventoryApi } from "../../services";
import { apiErrorMessage } from "../../utils";

/** Ajuste manual con motivo obligatorio: positivo suma, negativo resta. */
export function adjustStock(productId: Signal<number>) {
  const api = inject(InventoryApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const form: AdjustStockDto = { ...EmptyAdjustmentState };
  const pending = signal(false);

  const submit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    if (!form.quantity) { toast.error("Indica una cantidad distinta de cero."); return false; }
    pending.set(true);
    try {
      await api.adjust(productId(), { ...form });
      queryClient.invalidate(Resources.PRODUCTS, Resources.MOVEMENTS);
      toast.success("Stock ajustado.");
      Object.assign(form, { ...EmptyAdjustmentState });
      return true;
    } catch (error) {
      toast.error(apiErrorMessage(error));
      return false;
    } finally {
      pending.set(false);
    }
  };

  return { form, pending, submit };
}
