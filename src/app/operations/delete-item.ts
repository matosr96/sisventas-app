import { inject } from "@angular/core";
import { QueryClient } from "../api/query-client";
import { Confirm } from "../components/shared/confirm-dialog/confirm";
import { Toast } from "../components/shared/toaster/toast";
import { Resources, ScreenName, type Resource, type ScreenNameValue } from "../constants";
import { CategoriesApi, ProductsApi, PurchasesApi, SalesApi, SuppliersApi } from "../services";
import { apiErrorMessage } from "../utils";

interface DeleteConfig { remove: (id: number) => Promise<void>; title: string; confirm: string; label: string; success: string; invalidate: Resource[]; }

/** Una entrada por entidad. La confirmación es un diálogo modal que devuelve una promesa: nada ocurre hasta que se acepta. */
export function deleteItem() {
  const queryClient = inject(QueryClient);
  const confirm = inject(Confirm);
  const toast = inject(Toast);
  const products = inject(ProductsApi);
  const categories = inject(CategoriesApi);
  const suppliers = inject(SuppliersApi);
  const sales = inject(SalesApi);
  const purchases = inject(PurchasesApi);

  const config: Partial<Record<ScreenNameValue, DeleteConfig>> = {
    [ScreenName.PRODUCT]: {
      remove: (id) => products.remove(id), title: "Eliminar producto", label: "Eliminar",
      confirm: "Si tiene movimientos, quedará retirado en vez de borrarse.",
      success: "Producto eliminado o retirado.", invalidate: [Resources.PRODUCTS],
    },
    [ScreenName.CATEGORY]: {
      remove: (id) => categories.remove(id), title: "Eliminar categoría", label: "Eliminar",
      confirm: "Solo se puede eliminar una categoría sin productos.",
      success: "Categoría eliminada.", invalidate: [Resources.CATEGORIES],
    },
    [ScreenName.SUPPLIER]: {
      remove: (id) => suppliers.remove(id), title: "Eliminar proveedor", label: "Eliminar",
      confirm: "Si tiene compras, quedará inactivo en vez de borrarse.",
      success: "Proveedor eliminado o desactivado.", invalidate: [Resources.SUPPLIERS],
    },
    [ScreenName.SALE]: {
      remove: (id) => sales.remove(id), title: "Anular venta", label: "Anular",
      confirm: "Las unidades volverán al stock. Una venta con devoluciones ya no se puede anular.",
      success: "Venta anulada.", invalidate: [Resources.SALES, Resources.PRODUCTS, Resources.REPORTS],
    },
    [ScreenName.PURCHASE]: {
      remove: (id) => purchases.remove(id), title: "Anular compra", label: "Anular",
      confirm: "Sus unidades saldrán del stock; si ya se vendieron, no se podrá.",
      success: "Compra anulada.", invalidate: [Resources.PURCHASES, Resources.PRODUCTS, Resources.REPORTS],
    },
  };

  /** Devuelve true si se borró, para que la pantalla decida adónde ir DESPUÉS. */
  const remove = async (screenName: ScreenNameValue, id: number): Promise<boolean> => {
    const entry = config[screenName];
    if (!entry) return false;
    const accepted = await confirm.ask({ title: entry.title, message: entry.confirm, confirmLabel: entry.label, tone: "danger" });
    if (!accepted) return false;
    try {
      await entry.remove(id);
      queryClient.invalidate(...entry.invalidate);
      toast.success(entry.success);
      return true;
    } catch (error) {
      toast.error(apiErrorMessage(error));
      return false;
    }
  };

  return { remove };
}
