import { inject } from "@angular/core";
import { QueryClient } from "../api/query-client";
import { Toast } from "../components/shared/toaster/toast";
import { Resources, ScreenName, type Resource, type ScreenNameValue } from "../constants";
import { CategoriesApi, ProductsApi, PurchasesApi, SalesApi, SuppliersApi } from "../services";
import { apiErrorMessage } from "../utils";

interface DeleteConfig { remove: (id: number) => Promise<void>; confirm: string; success: string; invalidate: Resource[]; }

/** Una entrada por entidad. La confirmación es un toast con acción, nunca window.confirm. */
export function deleteItem() {
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const products = inject(ProductsApi);
  const categories = inject(CategoriesApi);
  const suppliers = inject(SuppliersApi);
  const sales = inject(SalesApi);
  const purchases = inject(PurchasesApi);

  const config: Partial<Record<ScreenNameValue, DeleteConfig>> = {
    [ScreenName.PRODUCT]: {
      remove: (id) => products.remove(id),
      confirm: "¿Eliminar este producto? Si tiene movimientos, quedará retirado en vez de borrarse.",
      success: "Producto eliminado o retirado.", invalidate: [Resources.PRODUCTS],
    },
    [ScreenName.CATEGORY]: {
      remove: (id) => categories.remove(id), confirm: "¿Eliminar esta categoría?",
      success: "Categoría eliminada.", invalidate: [Resources.CATEGORIES],
    },
    [ScreenName.SUPPLIER]: {
      remove: (id) => suppliers.remove(id),
      confirm: "¿Eliminar este proveedor? Si tiene compras, quedará inactivo en vez de borrarse.",
      success: "Proveedor eliminado o desactivado.", invalidate: [Resources.SUPPLIERS],
    },
    [ScreenName.SALE]: {
      remove: (id) => sales.remove(id), confirm: "¿Anular esta venta? Las unidades volverán al stock.",
      success: "Venta anulada.", invalidate: [Resources.SALES, Resources.PRODUCTS],
    },
    [ScreenName.PURCHASE]: {
      remove: (id) => purchases.remove(id),
      confirm: "¿Anular esta compra? Sus unidades saldrán del stock; si ya se vendieron, no se podrá.",
      success: "Compra anulada.", invalidate: [Resources.PURCHASES, Resources.PRODUCTS],
    },
  };

  const remove = (screenName: ScreenNameValue, id: number): void => {
    const entry = config[screenName];
    if (!entry) return;
    toast.warning(entry.confirm, {
      label: "Confirmar",
      onClick: () => {
        void entry.remove(id)
          .then(() => { queryClient.invalidate(...entry.invalidate); toast.success(entry.success); })
          .catch((error: unknown) => toast.error(apiErrorMessage(error)));
      },
    });
  };

  return { remove };
}
