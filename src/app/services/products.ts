import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { API_URL } from "../api/api-config";
import { Resources } from "../constants";
import type { Product, CreateProductDto, UpdateProductDto, ListState } from "../entities";

/** Contrato REST uniforme. Excepción documentada: la API actualiza con PUT /<recurso>/{id} y el cuerpo plano. */
@Injectable({ providedIn: "root" })
export class ProductsApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/${Resources.PRODUCTS}`;

  /** La API acota limit a 100; la paginación y la búsqueda se hacen en el cliente sobre items. */
  list(): Promise<ListState<Product>> {
    return firstValueFrom(this.http.get<ListState<Product>>(this.url, { params: { limit: 100 } }));
  }

  get(id: number): Promise<Product> {
    return firstValueFrom(this.http.get<Product>(`${this.url}/${id}`));
  }

  create(info: CreateProductDto): Promise<Product> {
    return firstValueFrom(this.http.post<Product>(this.url, info));
  }

  update(id: number, info: UpdateProductDto): Promise<Product> {
    return firstValueFrom(this.http.put<Product>(`${this.url}/${id}`, info));
  }

  remove(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.url}/${id}`));
  }
}
