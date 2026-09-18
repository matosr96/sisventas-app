import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { apiUrl } from "../api/api-config";
import { Resources } from "../constants";
import { toParams, type Category, CreateCategoryDto, ListQuery, ListState, UpdateCategoryDto } from "../entities";

/** Contrato REST uniforme: listado paginado y filtrado en servidor, PUT /<recurso>/{id} con cuerpo plano. */
@Injectable({ providedIn: "root" })
export class CategoriesApi {
  private readonly http = inject(HttpClient);
  private get url(): string { return `${apiUrl()}/${Resources.CATEGORIES}`; }

  list(query: ListQuery): Promise<ListState<Category>> {
    return firstValueFrom(this.http.get<ListState<Category>>(this.url, { params: toParams(query) }));
  }

  get(id: number): Promise<Category> {
    return firstValueFrom(this.http.get<Category>(`${this.url}/${id}`));
  }

  create(info: CreateCategoryDto): Promise<Category> {
    return firstValueFrom(this.http.post<Category>(this.url, info));
  }

  update(id: number, info: UpdateCategoryDto): Promise<Category> {
    return firstValueFrom(this.http.put<Category>(`${this.url}/${id}`, info));
  }

  remove(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.url}/${id}`));
  }
}
