import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { apiUrl } from "../api/api-config";
import { Resources } from "../constants";
import { toParams, type CreateSupplierDto, ListQuery, ListState, Supplier, UpdateSupplierDto } from "../entities";

/** Contrato REST uniforme: listado paginado y filtrado en servidor, PUT /<recurso>/{id} con cuerpo plano. */
@Injectable({ providedIn: "root" })
export class SuppliersApi {
  private readonly http = inject(HttpClient);
  private get url(): string { return `${apiUrl()}/${Resources.SUPPLIERS}`; }

  list(query: ListQuery): Promise<ListState<Supplier>> {
    return firstValueFrom(this.http.get<ListState<Supplier>>(this.url, { params: toParams(query) }));
  }

  get(id: number): Promise<Supplier> {
    return firstValueFrom(this.http.get<Supplier>(`${this.url}/${id}`));
  }

  create(info: CreateSupplierDto): Promise<Supplier> {
    return firstValueFrom(this.http.post<Supplier>(this.url, info));
  }

  update(id: number, info: UpdateSupplierDto): Promise<Supplier> {
    return firstValueFrom(this.http.put<Supplier>(`${this.url}/${id}`, info));
  }

  remove(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.url}/${id}`));
  }
}
