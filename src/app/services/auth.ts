import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { apiUrl } from "../api/api-config";
import type { ChangePasswordDto, Session, SigninDto, SignupDto, UpdateUserProfileDto, User } from "../entities";

/** Sesión y perfil propio. */
@Injectable({ providedIn: "root" })
export class AuthApi {
  private readonly http = inject(HttpClient);

  signin(info: SigninDto): Promise<Session> {
    return firstValueFrom(this.http.post<Session>(`${apiUrl()}/auth/signin`, info));
  }

  signup(info: SignupDto): Promise<Session> {
    return firstValueFrom(this.http.post<Session>(`${apiUrl()}/auth/signup`, info));
  }

  me(): Promise<User> {
    return firstValueFrom(this.http.get<User>(`${apiUrl()}/users/me`));
  }

  updateMe(info: UpdateUserProfileDto): Promise<User> {
    return firstValueFrom(this.http.put<User>(`${apiUrl()}/users/me`, info));
  }

  changePassword(info: ChangePasswordDto): Promise<void> {
    return firstValueFrom(this.http.put<void>(`${apiUrl()}/users/me/password`, info));
  }

  /** Invalida todos los tokens del usuario, el actual incluido. */
  logoutEverywhere(): Promise<void> {
    return firstValueFrom(this.http.post<void>(`${apiUrl()}/users/me/logout-all`, {}));
  }
}
