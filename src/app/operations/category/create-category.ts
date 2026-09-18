import { inject, signal } from "@angular/core";
import { QueryClient } from "../../api/query-client";
import { Toast } from "../../components/shared/toaster/toast";
import { Resources } from "../../constants";
import { EmptyCategoryState, type CreateCategoryDto } from "../../entities";
import { CategoriesApi } from "../../services";
import { apiErrorMessage } from "../../utils";

export function createCategory() {
  const api = inject(CategoriesApi);
  const queryClient = inject(QueryClient);
  const toast = inject(Toast);
  const form: CreateCategoryDto = { ...EmptyCategoryState };
  const pending = signal(false);

  const reset = (): void => { Object.assign(form, { ...EmptyCategoryState }); };

  /** Devuelve true si se creó, para que la pantalla cierre el modal. */
  const submit = async (event: Event): Promise<boolean> => {
    event.preventDefault();
    pending.set(true);
    try {
      await api.create({ ...form });
      queryClient.invalidate(Resources.CATEGORIES);
      toast.success("Categoría creada correctamente.");
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
