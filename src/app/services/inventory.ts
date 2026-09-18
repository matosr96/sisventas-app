import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { apiUrl } from "../api/api-config";
import { Resources } from "../constants";
import { toParams, type AdjustStockDto, type ListQuery, type ListState, type StockMovement } from "../entities";

/** Libro de stock: por producto (cuelga del producto) o global (/inventory/movements), y ajustes. */
@Injectable({ providedIn: "root" })
export class InventoryApi {
  private readonly http = inject(HttpClient);
  private get products(): string { return `${apiUrl()}/${Resources.PRODUCTS}`; }

  movements(productId: number, page = 1, limit = 10): Promise<ListState<StockMovement>> {
    return firstValueFrom(
      this.http.get<ListState<StockMovement>>(`${this.products}/${productId}/${Resources.MOVEMENTS}`, { params: { page, limit } })
    );
  }

  listAll(query: ListQuery): Promise<ListState<StockMovement>> {
    return firstValueFrom(
      this.http.get<ListState<StockMovement>>(`${apiUrl()}/inventory/${Resources.MOVEMENTS}`, { params: toParams(query) })
    );
  }

  adjust(productId: number, info: AdjustStockDto): Promise<StockMovement> {
    return firstValueFrom(this.http.post<StockMovement>(`${this.products}/${productId}/adjustments`, info));
  }
}
