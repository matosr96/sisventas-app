import { Component, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ProductTile } from "../../../components/container";
import { Layout } from "../../../components/layout/layout";
import { ButtonCnt, FilterChips, HeaderPage, Skeleton, type FilterOption } from "../../../components/shared";
import { PrivateRoutes } from "../../../constants";
import { createSale } from "../../../operations/sale/create-sale";
import { formatMoney } from "../../../utils";

/** Caja: catálogo en baldosas a la izquierda, pedido fijo a la derecha. Tocar un producto lo añade. */
@Component({
  selector: "app-new-sale",
  imports: [Layout, HeaderPage, Skeleton, ProductTile, FilterChips, ButtonCnt, RouterLink],
  templateUrl: "./new-sale.html",
  styleUrl: "./new-sale.css",
})
export class NewSale {
  readonly op = createSale();
  readonly routes = PrivateRoutes;
  readonly formatMoney = formatMoney;
  readonly categoryOptions = computed<FilterOption[]>(() =>
    this.op.categories().map((category) => ({ value: String(category.id), label: category.name }))
  );

  onSearch(event: Event): void { this.op.searchTerm.set((event.target as HTMLInputElement).value); }
  onSearchEnter(event: Event): void { event.preventDefault(); this.op.addFromSearch(); }
  onQuantity(productId: number, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.op.setQuantity(productId, raw === "" ? null : Number(raw));
  }
}
