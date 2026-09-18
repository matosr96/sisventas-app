import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { apiUrl } from "../api/api-config";
import { Resources } from "../constants";
import { toParams, type CreateProductDto, ListQuery, ListState, Product, UpdateProductDto } from "../entities";

/** Contrato REST uniforme: listado paginado y filtrado en servidor, PUT /<recurso>/{id} con cuerpo plano. */
@Injectable({ providedIn: "root" })
export class ProductsApi {
  private readonly http = inject(HttpClient);
  private get url(): string { return `${apiUrl()}/${Resources.PRODUCTS}`; }

  list(query: ListQuery): Promise<ListState<Product>> {
    return firstValueFrom(this.http.get<ListState<Product>>(this.url, { params: toParams(query) }));
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
