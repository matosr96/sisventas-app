import { inject, signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { Resources } from "../../constants";
import { EmptySupplierState, type CreateSupplierDto } from "../../entities";
import { SuppliersApi } from "../../services";
import { apiErrorMessage } from "../../utils";

export function createSupplier() {
  const api = inject(SuppliersApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const form: CreateSupplierDto = { ...EmptySupplierState };
  const pending = signal(false);

  const reset = (): void => { Object.assign(form, { ...EmptySupplierState }); };

  /** Devuelve true si se creó, para que la pantalla cierre el modal. */
  const submit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    if (pending()) return false; // Enter repetido mientras se guarda: una sola petición
    pending.set(true);
    try {
      await api.create({ ...form });
      queryClient.invalidate(Resources.SUPPLIERS);
      toast.success("Proveedor creado correctamente.");
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
