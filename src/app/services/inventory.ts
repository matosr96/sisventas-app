import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { API_URL } from "../api/api-config";
import { Resources } from "../constants";
import type { AdjustStockDto, ListState, StockMovement } from "../entities";

/** Libro de stock y ajustes: cuelgan del producto en la API. */
@Injectable({ providedIn: "root" })
export class InventoryApi {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/${Resources.PRODUCTS}`;

  movements(productId: number, page = 1, limit = 10): Promise<ListState<StockMovement>> {
    return firstValueFrom(
      this.http.get<ListState<StockMovement>>(`${this.url}/${productId}/${Resources.MOVEMENTS}`, { params: { page, limit } })
    );
  }

  adjust(productId: number, info: AdjustStockDto): Promise<StockMovement> {
    return firstValueFrom(this.http.post<StockMovement>(`${this.url}/${productId}/adjustments`, info));
  }
}
