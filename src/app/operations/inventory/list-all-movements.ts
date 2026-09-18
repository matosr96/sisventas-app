import { inject } from "@angular/core";
import { Resources } from "../../constants";
import type { ListQuery } from "../../entities";
import { InventoryApi } from "../../services";
import { serverList } from "../list-resource";

/** Listado en servidor: página, orden, búsqueda y chips viajan como params; la API decide. */
export function listAllMovements(initial: Partial<ListQuery> = {}) {
  const api = inject(InventoryApi);
  return serverList(Resources.MOVEMENTS, (query) => api.listAll(query), { sort: "createdAt", dir: "desc", ...initial });
}
