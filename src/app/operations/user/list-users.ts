import { inject } from "@angular/core";
import { Resources } from "../../constants";
import type { ListQuery } from "../../entities";
import { UsersApi } from "../../services";
import { serverList } from "../list-resource";

/** Listado en servidor: página, orden, búsqueda y chips viajan como params; la API decide. */
export function listUsers(initial: Partial<ListQuery> = {}) {
  const api = inject(UsersApi);
  return serverList(Resources.USERS, (query) => api.list(query), { sort: "createdAt", dir: "desc", ...initial });
}
