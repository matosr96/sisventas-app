import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { API_URL } from "../api/api-config";
import { Resources } from "../constants";
import type { CreateSaleDto, ListState, Sale } from "../entities";

@Injectable({ providedIn: "root" })
export class SalesApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/${Resources.SALES}`;

  list(): Promise<ListState<Sale>> {
    return firstValueFrom(this.http.get<ListState<Sale>>(this.url, { params: { limit: 100 } }));
  }

  get(id: number): Promise<Sale> {
    return firstValueFrom(this.http.get<Sale>(`${this.url}/${id}`));
  }

  create(info: CreateSaleDto): Promise<Sale> {
    return firstValueFrom(this.http.post<Sale>(this.url, info));
  }

  /** Solo la fecha es corregible: líneas y total son inmutables. */
  updateDate(id: number, saleDate: string): Promise<Sale> {
    return firstValueFrom(this.http.put<Sale>(`${this.url}/${id}`, { saleDate }));
  }

  /** Anular devuelve el stock. */
  remove(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.url}/${id}`));
  }

  /** El PDF viaja con el token en la cabecera, por eso no basta un enlace. */
  pdf(id: number): Promise<Blob> {
    return firstValueFrom(this.http.get(`${this.url}/${id}/pdf`, { responseType: "blob" }));
  }
}
