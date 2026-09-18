import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { API_URL } from "../api/api-config";
import { Resources } from "../constants";
import type { CreatePurchaseDto, ListState, Purchase } from "../entities";

@Injectable({ providedIn: "root" })
export class PurchasesApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/${Resources.PURCHASES}`;

  list(): Promise<ListState<Purchase>> {
    return firstValueFrom(this.http.get<ListState<Purchase>>(this.url, { params: { limit: 100 } }));
  }

  get(id: number): Promise<Purchase> {
    return firstValueFrom(this.http.get<Purchase>(`${this.url}/${id}`));
  }

  create(info: CreatePurchaseDto): Promise<Purchase> {
    return firstValueFrom(this.http.post<Purchase>(this.url, info));
  }

  updateDate(id: number, purchaseDate: string): Promise<Purchase> {
    return firstValueFrom(this.http.put<Purchase>(`${this.url}/${id}`, { purchaseDate }));
  }

  /** Anular retira del stock lo que sumó; la API lo rechaza (621) si ya se vendió. */
  remove(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.url}/${id}`));
  }
}
