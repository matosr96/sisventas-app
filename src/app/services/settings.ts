import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { apiUrl } from "../api/api-config";
import { Resources } from "../constants";
import type { Settings } from "../entities";

@Injectable({ providedIn: "root" })
export class SettingsApi {
  private readonly http = inject(HttpClient);

  get(): Promise<Settings> {
    return firstValueFrom(this.http.get<Settings>(`${apiUrl()}/${Resources.SETTINGS}`));
  }
}
