import { Component, computed, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Empty, Table, type Row } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { DateRangePicker, HeaderPage, Skeleton, type DateRange } from "../../components/shared";
import { PrivateRoutes, ScreenName } from "../../constants";
import { deleteItem } from "../../operations/delete-item";
import { listPurchases } from "../../operations/purchase/list-purchases";
import { dayRangeToInstants, formatDateTime, formatMoney } from "../../utils";

@Component({
  selector: "app-purchases",
  imports: [Layout, HeaderPage, Skeleton, Table, Empty, DateRangePicker],
  templateUrl: "./purchases.html",
  styleUrl: "./purchases.css",
})
export class Purchases {
  private readonly router = inject(Router);
  readonly screen = ScreenName.PURCHASE;
  readonly list = listPurchases();
  readonly remover = deleteItem();
  readonly range = computed<DateRange>(() => ({ from: this.list.filters()["fromDay"] ?? null, to: this.list.filters()["toDay"] ?? null }));
  readonly rows = computed<Row[]>(() =>
    this.list.items().map((purchase) => ({
      ...purchase, number: purchase.purchaseNumber, date: formatDateTime(purchase.purchaseDate), lines: purchase.items.length, total: formatMoney(purchase.total),
    }))
  );

  setRange(range: DateRange): void {
    const instants = dayRangeToInstants(range.from, range.to);
    this.list.setFilters({ fromDay: range.from, toDay: range.to, from: instants.from, to: instants.to });
  }
  create(): void { void this.router.navigate([PrivateRoutes.PURCHASES, "nueva"]); }
  open(row: Row): void { void this.router.navigate([PrivateRoutes.PURCHASES, row["id"]]); }
  remove(row: Row): void { void this.remover.remove(this.screen, Number(row["id"])); }
}
