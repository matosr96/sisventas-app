import { inject, signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { Resources } from "../../constants";
import type { Product, UpdateProductDto } from "../../entities";
import { ProductsApi } from "../../services";
import { apiErrorMessage } from "../../utils";

/** El formulario nace con los datos del registro; la pantalla lo recrea por registro, no lo sincroniza. */
export function updateProduct(current: Product, pick: (item: Product) => UpdateProductDto) {
  const api = inject(ProductsApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const form: UpdateProductDto = pick(current);
  const pending = signal(false);

  const submit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    pending.set(true);
    try {
      await api.update(current.id, { ...form });
      queryClient.invalidate(Resources.PRODUCTS);
      toast.success("Producto actualizado.");
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
