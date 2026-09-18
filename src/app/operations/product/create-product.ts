import { inject, signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { Resources } from "../../constants";
import { EmptyProductState, type CreateProductDto } from "../../entities";
import { ProductsApi } from "../../services";
import { apiErrorMessage } from "../../utils";

export function createProduct() {
  const api = inject(ProductsApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const form: CreateProductDto = { ...EmptyProductState };
  const pending = signal(false);

  const reset = (): void => { Object.assign(form, { ...EmptyProductState }); };

  /** Devuelve true si se creó, para que la pantalla cierre el modal. */
  const submit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    pending.set(true);
    try {
      await api.create({ ...form });
      queryClient.invalidate(Resources.PRODUCTS);
      toast.success("Producto creado correctamente.");
      reset();
      return true;
    } catch (error) {
      toast.error(apiErrorMessage(error));
      return false;
    } finally {
      pending.set(false);
    }
  };

  return { form, pending, submit, reset };
}
