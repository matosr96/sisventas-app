import { computed, inject, signal } from "@angular/core";
import { Resources } from "../../constants";
import { EmptyCategoriesState, type Category } from "../../entities";
import { CategoriesApi } from "../../services";
import { listResource, safeValue } from "../list-resource";

/** Listado con búsqueda derivada en el render: el término se guarda, el filtro no. */
export function listCategories(matches: (item: Category, term: string) => boolean) {
  const api = inject(CategoriesApi);
  const ref = listResource(Resources.CATEGORIES, () => api.list(), EmptyCategoriesState);
  const data = safeValue(ref, EmptyCategoriesState);
  const searchTerm = signal("");
  const items = computed(() => data().items);
  const filtered = computed(() => {
    const term = searchTerm().trim().toLowerCase();
    return term ? items().filter((item) => matches(item, term)) : items();
  });
  return { ref, items, filtered, searchTerm, isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
