import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { apiUrl } from "../api/api-config";
import { Resources } from "../constants";
import { toParams, type Audit, type ListQuery, type ListState } from "../entities";

/** Solo lectura y solo ADMIN: la auditoría la escribe la API. */
@Injectable({ providedIn: "root" })
export class AuditsApi {
  private readonly http = inject(HttpClient);

  /** El buscador filtra por recurso: la API lo llama `resource`, no `search`. */
  list(query: ListQuery): Promise<ListState<Audit>> {
    const { search, ...params } = toParams(query);
    return firstValueFrom(this.http.get<ListState<Audit>>(`${apiUrl()}/${Resources.AUDITS}`, { params: search ? { ...params, resource: search } : params }));
  }
}
