import { inject } from "@angular/core";
import { Resources } from "../../constants";
import type { ListQuery } from "../../entities";
import { SuppliersApi } from "../../services";
import { serverList } from "../list-resource";

/** Listado en servidor: página, orden, búsqueda y chips viajan como params; la API decide. */
export function listSuppliers(initial: Partial<ListQuery> = {}) {
  const api = inject(SuppliersApi);
  return serverList(Resources.SUPPLIERS, (query) => api.list(query), { sort: "name", dir: "asc", ...initial });
}
