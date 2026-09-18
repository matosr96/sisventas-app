import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { API_URL } from "../api/api-config";
import { Resources } from "../constants";
import type { Supplier, CreateSupplierDto, UpdateSupplierDto, ListState } from "../entities";

/** Contrato REST uniforme. Excepción documentada: la API actualiza con PUT /<recurso>/{id} y el cuerpo plano. */
@Injectable({ providedIn: "root" })
export class SuppliersApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/${Resources.SUPPLIERS}`;

  /** La API acota limit a 100; la paginación y la búsqueda se hacen en el cliente sobre items. */
  list(): Promise<ListState<Supplier>> {
    return firstValueFrom(this.http.get<ListState<Supplier>>(this.url, { params: { limit: 100 } }));
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
