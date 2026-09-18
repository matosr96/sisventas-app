import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { apiUrl } from "../api/api-config";
import { Resources } from "../constants";
import { toParams, type CreateUserDto, ListQuery, ListState, ResetPasswordDto, RoleNameValue, UpdateUserProfileDto, User, UserStatusValue } from "../entities";

/** Contrato REST uniforme: listado paginado y filtrado en servidor, PUT /<recurso>/{id} con cuerpo plano. */
@Injectable({ providedIn: "root" })
export class UsersApi {
  private readonly http = inject(HttpClient);
  private get url(): string { return `${apiUrl()}/${Resources.USERS}`; }

  list(query: ListQuery): Promise<ListState<User>> {
    return firstValueFrom(this.http.get<ListState<User>>(this.url, { params: toParams(query) }));
  }

  get(id: number): Promise<User> {
    return firstValueFrom(this.http.get<User>(`${this.url}/${id}`));
  }

  /** Alta por administrador: sin límite de registro y con rol de entrada. */
  create(info: CreateUserDto): Promise<User> {
    return firstValueFrom(this.http.post<User>(this.url, info));
  }

  update(id: number, info: UpdateUserProfileDto): Promise<User> {
    return firstValueFrom(this.http.put<User>(`${this.url}/${id}`, info));
  }

  setRoles(id: number, roles: RoleNameValue[]): Promise<User> {
    return firstValueFrom(this.http.put<User>(`${this.url}/${id}/roles`, { roles }));
  }

  setStatus(id: number, status: UserStatusValue): Promise<User> {
    return firstValueFrom(this.http.put<User>(`${this.url}/${id}/status`, { status }));
  }

  /** Reinicio sin la contraseña actual; la API cierra las sesiones de ese usuario. */
  resetPassword(id: number, info: ResetPasswordDto): Promise<void> {
    return firstValueFrom(this.http.put<void>(`${this.url}/${id}/password`, info));
  }
}
