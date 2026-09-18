import { Component, computed, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Empty, Table, type Row } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { HeaderPage, Loader } from "../../components/shared";
import { PrivateRoutes, ScreenName } from "../../constants";
import { deleteItem } from "../../operations/delete-item";
import { listPurchases } from "../../operations/purchase/list-purchases";
import { formatDateTime, formatMoney } from "../../utils";

@Component({
  selector: "app-purchases",
  imports: [Layout, HeaderPage, Loader, Table, Empty],
  templateUrl: "./purchases.html",
  styleUrl: "./purchases.css",
})
export class Purchases {
  private readonly router = inject(Router);
  readonly screen = ScreenName.PURCHASE;
  readonly list = listPurchases();
  readonly remover = deleteItem();
  readonly rows = computed<Row[]>(() =>
    this.list.filtered().map((purchase) => ({
      ...purchase, dateLabel: formatDateTime(purchase.purchaseDate), totalLabel: formatMoney(purchase.total), lines: purchase.items.length,
    }))
  );

  create(): void { void this.router.navigate([PrivateRoutes.PURCHASES, "nueva"]); }
  open(row: Row): void { void this.router.navigate([PrivateRoutes.PURCHASES, row["id"]]); }
  remove(row: Row): void { this.remover.remove(this.screen, Number(row["id"])); }
}
