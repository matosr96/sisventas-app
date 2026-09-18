import { Component, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { ProductTile } from "../../../components/container";
import { Layout } from "../../../components/layout/layout";
import { ButtonCnt, FilterChips, HeaderPage, SelectCpt, Skeleton, type FilterOption, type SelectOption } from "../../../components/shared";
import { PrivateRoutes } from "../../../constants";
import { createPurchase } from "../../../operations/purchase/create-purchase";
import { formatMoney } from "../../../utils";

/** Misma disposición que la venta: catálogo a la izquierda, orden de compra a la derecha con proveedor y costos. */
@Component({
  selector: "app-new-purchase",
  imports: [Layout, HeaderPage, Skeleton, ProductTile, FilterChips, SelectCpt, ButtonCnt, RouterLink],
  templateUrl: "./new-purchase.html",
  styleUrl: "./new-purchase.css",
})
export class NewPurchase {
  readonly op = createPurchase();
  readonly routes = PrivateRoutes;
  readonly formatMoney = formatMoney;
  readonly supplierOptions = computed<SelectOption<number>[]>(() => this.op.activeSuppliers().map((s) => ({ value: s.id, label: s.name })));
  readonly categoryOptions = computed<FilterOption[]>(() =>
    this.op.categories().map((category) => ({ value: String(category.id), label: category.name }))
  );

  onSearch(event: Event): void { this.op.searchTerm.set((event.target as HTMLInputElement).value); }
  onSearchEnter(event: Event): void { event.preventDefault(); this.op.addFromSearch(); }
  onQuantity(productId: number, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.op.setQuantity(productId, raw === "" ? null : Number(raw));
  }
  onCost(productId: number, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.op.setUnitCost(productId, raw === "" ? null : Number(raw));
  }
}
