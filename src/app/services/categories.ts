import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { API_URL } from "../api/api-config";
import { Resources } from "../constants";
import type { Category, CreateCategoryDto, UpdateCategoryDto, ListState } from "../entities";

/** Contrato REST uniforme. Excepción documentada: la API actualiza con PUT /<recurso>/{id} y el cuerpo plano. */
@Injectable({ providedIn: "root" })
export class CategoriesApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/${Resources.CATEGORIES}`;

  /** La API acota limit a 100; la paginación y la búsqueda se hacen en el cliente sobre items. */
  list(): Promise<ListState<Category>> {
    return firstValueFrom(this.http.get<ListState<Category>>(this.url, { params: { limit: 100 } }));
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
