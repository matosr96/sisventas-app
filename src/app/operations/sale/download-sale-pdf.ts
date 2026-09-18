import { inject, signal } from "@angular/core";
import { Toast } from "../../components/shared/toaster/toast";
import { SalesApi } from "../../services";
import { apiErrorMessage } from "../../utils";

/** Abre la factura en otra pestaña. Va por HttpClient porque el PDF exige el token. */
export function downloadSalePdf() {
  const api = inject(SalesApi);
  const toast = inject(Toast);
  const pending = signal(false);

  const open = async (id: number): Promise<void> => {
    pending.set(true);
    try {
      const blob = await api.pdf(id);
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank", "noopener");
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (error) {
      toast.error(apiErrorMessage(error));
    } finally {
      pending.set(false);
    }
  };

  return { open, pending };
}
