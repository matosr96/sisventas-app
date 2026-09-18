import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { apiUrl } from "../api/api-config";
import { Resources } from "../constants";
import { toParams, type CreatePurchaseDto, ListQuery, ListState, Purchase } from "../entities";

/** Contrato REST uniforme: listado paginado y filtrado en servidor, PUT /<recurso>/{id} con cuerpo plano. */
@Injectable({ providedIn: "root" })
export class PurchasesApi {
  private readonly http = inject(HttpClient);
  private get url(): string { return `${apiUrl()}/${Resources.PURCHASES}`; }

  list(query: ListQuery): Promise<ListState<Purchase>> {
    return firstValueFrom(this.http.get<ListState<Purchase>>(this.url, { params: toParams(query) }));
  }

  get(id: number): Promise<Purchase> {
    return firstValueFrom(this.http.get<Purchase>(`${this.url}/${id}`));
  }

  create(info: CreatePurchaseDto): Promise<Purchase> {
    return firstValueFrom(this.http.post<Purchase>(this.url, info));
  }

  /** Solo la fecha es corregible: líneas y total son inmutables. */
  updateDate(id: number, purchaseDate: string): Promise<Purchase> {
    return firstValueFrom(this.http.put<Purchase>(`${this.url}/${id}`, { purchaseDate }));
  }

  /** Anular retira del stock lo que la compra había sumado. */
  remove(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.url}/${id}`));
  }
}
