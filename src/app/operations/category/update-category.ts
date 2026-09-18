import { inject, signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { Resources } from "../../constants";
import type { Category, UpdateCategoryDto } from "../../entities";
import { CategoriesApi } from "../../services";
import { apiErrorMessage } from "../../utils";

/** El formulario nace con los datos del registro; la pantalla lo recrea por registro, no lo sincroniza. */
export function updateCategory(current: Category, pick: (item: Category) => UpdateCategoryDto) {
  const api = inject(CategoriesApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const form: UpdateCategoryDto = pick(current);
  const pending = signal(false);

  const submit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    if (pending()) return false; // Enter repetido mientras se guarda: una sola petición
    pending.set(true);
    try {
      await api.update(current.id, { ...form });
      queryClient.invalidate(Resources.CATEGORIES);
      toast.success("Categoría actualizada.");
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
