import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { apiUrl } from "../api/api-config";
import { Resources } from "../constants";
import { toParams, type CreateSaleDto, CreateSaleReturnDto, ListQuery, ListState, Sale, SaleReturn } from "../entities";

/** Contrato REST uniforme: listado paginado y filtrado en servidor, PUT /<recurso>/{id} con cuerpo plano. */
@Injectable({ providedIn: "root" })
export class SalesApi {
  private readonly http = inject(HttpClient);
  private get url(): string { return `${apiUrl()}/${Resources.SALES}`; }

  list(query: ListQuery): Promise<ListState<Sale>> {
    return firstValueFrom(this.http.get<ListState<Sale>>(this.url, { params: toParams(query) }));
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

  /** Anular devuelve el stock. Rechazado (628) si ya tiene devoluciones. */
  remove(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.url}/${id}`));
  }

  returns(id: number): Promise<SaleReturn[]> {
    return firstValueFrom(this.http.get<SaleReturn[]>(`${this.url}/${id}/${Resources.RETURNS}`));
  }

  createReturn(id: number, info: CreateSaleReturnDto): Promise<SaleReturn> {
    return firstValueFrom(this.http.post<SaleReturn>(`${this.url}/${id}/${Resources.RETURNS}`, info));
  }

  /** El PDF viaja con el token en la cabecera, por eso no basta un enlace. `receipt` = tirilla de 80 mm. */
  pdf(id: number, format: "invoice" | "receipt" = "invoice"): Promise<Blob> {
    return firstValueFrom(this.http.get(`${this.url}/${id}/pdf`, { params: { format }, responseType: "blob" }));
  }
}
