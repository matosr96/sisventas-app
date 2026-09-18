import { inject } from "@angular/core";
import { Resources } from "../../constants";
import type { ListQuery } from "../../entities";
import { SalesApi } from "../../services";
import { serverList } from "../list-resource";

/** Listado en servidor: página, orden, búsqueda y chips viajan como params; la API decide. */
export function listSales(initial: Partial<ListQuery> = {}) {
  const api = inject(SalesApi);
  return serverList(Resources.SALES, (query) => api.list(query), { sort: "date", dir: "desc", ...initial });
}
