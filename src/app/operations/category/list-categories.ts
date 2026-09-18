import { computed, inject } from "@angular/core";
import { Resources } from "../../constants";
import { EmptyCategoriesState, type Category } from "../../entities";
import { CategoriesApi } from "../../services";
import { filterableList, listResource, safeValue } from "../list-resource";

/** Listado con búsqueda y chips derivados en el render: se guarda el término y los filtros, no la lista. */
export function listCategories(matches: (item: Category, term: string) => boolean) {
  const api = inject(CategoriesApi);
  const ref = listResource(Resources.CATEGORIES, () => api.list(), EmptyCategoriesState);
  const data = safeValue(ref, EmptyCategoriesState);
  const items = computed(() => data().items);
  const search = filterableList(items, matches);
  return { ref, items, ...search, isLoading: ref.isLoading, isError: computed(() => ref.error() != null) };
}
