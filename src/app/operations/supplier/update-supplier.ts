import { inject, signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { Resources } from "../../constants";
import type { Supplier, UpdateSupplierDto } from "../../entities";
import { SuppliersApi } from "../../services";
import { apiErrorMessage } from "../../utils";

/** El formulario nace con los datos del registro; la pantalla lo recrea por registro, no lo sincroniza. */
export function updateSupplier(current: Supplier, pick: (item: Supplier) => UpdateSupplierDto) {
  const api = inject(SuppliersApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const form: UpdateSupplierDto = pick(current);
  const pending = signal(false);

  const submit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    pending.set(true);
    try {
      await api.update(current.id, { ...form });
      queryClient.invalidate(Resources.SUPPLIERS);
      toast.success("Proveedor actualizado.");
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
