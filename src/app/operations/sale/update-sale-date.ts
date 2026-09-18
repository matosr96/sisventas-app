import { inject, signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { Resources } from "../../constants";
import { SalesApi } from "../../services";
import { apiErrorMessage, fromDateTimeInput } from "../../utils";

/** Lo único corregible de una venta registrada: su fecha (la API la exige pasada o presente). */
export function updateSaleDate(saleId: () => number) {
  const api = inject(SalesApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const value = signal("");
  const pending = signal(false);

  const submit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    if (pending()) return false;
    const iso = fromDateTimeInput(value());
    if (!iso) { toast.error("Indica la fecha y hora de la venta."); return false; }
    pending.set(true);
    try {
      await api.updateDate(saleId(), iso);
      queryClient.invalidate(Resources.SALES, Resources.REPORTS);
      toast.success("Fecha de la venta corregida.");
      return true;
    } catch (error) {
      toast.error(apiErrorMessage(error));
      return false;
    } finally {
      pending.set(false);
    }
  };

  return { value, pending, submit };
}
