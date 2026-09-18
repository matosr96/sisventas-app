import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { API_URL } from "../api/api-config";
import { Resources } from "../constants";
import type { ListState, RoleNameValue, User, UserStatusValue } from "../entities";

/** Gestión de usuarios (solo ADMIN). El alta pública es el signup de AuthApi. */
@Injectable({ providedIn: "root" })
export class UsersApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/${Resources.USERS}`;

  list(): Promise<ListState<User>> {
    return firstValueFrom(this.http.get<ListState<User>>(this.url, { params: { limit: 100 } }));
  }

  get(id: number): Promise<User> {
    return firstValueFrom(this.http.get<User>(`${this.url}/${id}`));
  }

  setRoles(id: number, roles: RoleNameValue[]): Promise<User> {
    return firstValueFrom(this.http.put<User>(`${this.url}/${id}/roles`, { roles }));
  }

  setStatus(id: number, status: UserStatusValue): Promise<User> {
    return firstValueFrom(this.http.put<User>(`${this.url}/${id}/status`, { status }));
  }
}
