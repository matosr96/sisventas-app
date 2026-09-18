import { inject, signal } from "@angular/core";
import { Toast } from "../../components/shared/toaster/toast";
import { SalesApi } from "../../services";
import { apiErrorMessage } from "../../utils";

/**
 * Factura (A4) o tirilla (80 mm) de la API. Va por HttpClient porque el PDF exige el token.
 * `open` lo abre en otra pestaña; `print` lo manda directo al diálogo de impresión (impresora
 * térmica de la caja) en un iframe oculto, sin salir de la pantalla.
 */
export function downloadSalePdf() {
  const api = inject(SalesApi);
  const toast = inject(Toast);
  const pending = signal(false);

  const fetchUrl = async (id: number, format: "invoice" | "receipt"): Promise<string | null> => {
    pending.set(true);
    try {
      return URL.createObjectURL(await api.pdf(id, format));
    } catch (error) {
      toast.error(apiErrorMessage(error));
      return null;
    } finally {
      pending.set(false);
    }
  };

  const open = async (id: number, format: "invoice" | "receipt" = "invoice"): Promise<void> => {
    const url = await fetchUrl(id, format);
    if (!url) return;
    const tab = window.open(url, "_blank", "noopener");
    if (!tab) toast.notice("El navegador bloqueó la pestaña; permite ventanas emergentes para ver el PDF.");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const print = async (id: number, format: "invoice" | "receipt" = "receipt"): Promise<void> => {
    const url = await fetchUrl(id, format);
    if (!url) return;
    const frame = document.createElement("iframe");
    frame.style.position = "fixed";
    frame.style.right = "0";
    frame.style.bottom = "0";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.style.border = "0";
    frame.src = url;
    frame.onload = () => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      setTimeout(() => { frame.remove(); URL.revokeObjectURL(url); }, 60_000);
    };
    document.body.appendChild(frame);
  };

  return { open, print, pending };
}
