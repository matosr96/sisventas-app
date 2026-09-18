import { inject } from "@angular/core";
import { Resources } from "../../constants";
import type { ListQuery } from "../../entities";
import { AuditsApi } from "../../services";
import { serverList } from "../list-resource";

/** Listado en servidor: página, orden, búsqueda y chips viajan como params; la API decide. */
export function listAudits(initial: Partial<ListQuery> = {}) {
  const api = inject(AuditsApi);
  return serverList(Resources.AUDITS, (query) => api.list(query), { sort: "createdAt", dir: "desc", ...initial });
}
