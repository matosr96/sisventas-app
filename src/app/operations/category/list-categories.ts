import { inject } from "@angular/core";
import { Resources } from "../../constants";
import type { ListQuery } from "../../entities";
import { CategoriesApi } from "../../services";
import { serverList } from "../list-resource";

/** Listado en servidor: página, orden, búsqueda y chips viajan como params; la API decide. */
export function listCategories(initial: Partial<ListQuery> = {}) {
  const api = inject(CategoriesApi);
  return serverList(Resources.CATEGORIES, (query) => api.list(query), { sort: "name", dir: "asc", ...initial });
}
