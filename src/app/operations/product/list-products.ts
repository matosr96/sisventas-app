import { inject } from "@angular/core";
import { Resources } from "../../constants";
import type { ListQuery } from "../../entities";
import { ProductsApi } from "../../services";
import { serverList } from "../list-resource";

/** Listado en servidor: página, orden, búsqueda y chips viajan como params; la API decide. */
export function listProducts(initial: Partial<ListQuery> = {}) {
  const api = inject(ProductsApi);
  return serverList(Resources.PRODUCTS, (query) => api.list(query), { sort: "name", dir: "asc", ...initial });
}
