import { inject, signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { Resources } from "../../constants";
import { PurchasesApi } from "../../services";
import { apiErrorMessage, fromDateTimeInput } from "../../utils";

/** Lo único corregible de una compra registrada: su fecha. */
export function updatePurchaseDate(purchaseId: () => number) {
  const api = inject(PurchasesApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const value = signal("");
  const pending = signal(false);

  const submit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    if (pending()) return false;
    const iso = fromDateTimeInput(value());
    if (!iso) { toast.error("Indica la fecha y hora de la compra."); return false; }
    pending.set(true);
    try {
      await api.updateDate(purchaseId(), iso);
      queryClient.invalidate(Resources.PURCHASES, Resources.REPORTS);
      toast.success("Fecha de la compra corregida.");
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
