import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { API_URL } from "../api/api-config";
import type { ChangePasswordDto, Session, SigninDto, SignupDto, User } from "../entities";

@Injectable({ providedIn: "root" })
export class AuthApi {
  private readonly http = inject(HttpClient);

  signin(info: SigninDto): Promise<Session> {
    return firstValueFrom(this.http.post<Session>(`${API_URL}/auth/signin`, info));
  }

  signup(info: SignupDto): Promise<Session> {
    return firstValueFrom(this.http.post<Session>(`${API_URL}/auth/signup`, info));
  }

  me(): Promise<User> {
    return firstValueFrom(this.http.get<User>(`${API_URL}/users/me`));
  }

  changePassword(info: ChangePasswordDto): Promise<void> {
    return firstValueFrom(this.http.put<void>(`${API_URL}/users/me/password`, info));
  }
}
