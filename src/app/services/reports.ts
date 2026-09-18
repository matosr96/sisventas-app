import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { apiUrl } from "../api/api-config";
import { Resources } from "../constants";
import type { CashClosing, SalesReport, Summary } from "../entities";

/** Agregados que calcula la API: nada de sumar listas en el cliente. */
@Injectable({ providedIn: "root" })
export class ReportsApi {
  private readonly http = inject(HttpClient);
  private get url(): string { return `${apiUrl()}/${Resources.REPORTS}`; }

  summary(): Promise<Summary> {
    return firstValueFrom(this.http.get<Summary>(`${this.url}/summary`));
  }

  /** Fechas yyyy-MM-dd; sin ellas, los últimos 30 días. */
  sales(from: string | null, to: string | null): Promise<SalesReport> {
    return firstValueFrom(this.http.get<SalesReport>(`${this.url}/sales`, { params: compact({ from, to }) }));
  }

  closing(date: string | null, userId: number | null): Promise<CashClosing> {
    return firstValueFrom(this.http.get<CashClosing>(`${this.url}/closing`, { params: compact({ date, userId }) }));
  }
}

const compact = (params: Record<string, string | number | null>): Record<string, string | number> =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value != null && value !== "")) as Record<string, string | number>;
