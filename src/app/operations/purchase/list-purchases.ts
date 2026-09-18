import { inject } from "@angular/core";
import { Resources } from "../../constants";
import type { ListQuery } from "../../entities";
import { PurchasesApi } from "../../services";
import { serverList } from "../list-resource";

/** Listado en servidor: página, orden, búsqueda y chips viajan como params; la API decide. */
export function listPurchases(initial: Partial<ListQuery> = {}) {
  const api = inject(PurchasesApi);
  return serverList(Resources.PURCHASES, (query) => api.list(query), { sort: "date", dir: "desc", ...initial });
}
