import { Component, computed, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Empty, Table, type Row } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { HeaderPage, Skeleton } from "../../components/shared";
import { PrivateRoutes, ScreenName } from "../../constants";
import { deleteItem } from "../../operations/delete-item";
import { listSales } from "../../operations/sale/list-sales";
import { formatDateTime, formatMoney } from "../../utils";

@Component({
  selector: "app-sales",
  imports: [Layout, HeaderPage, Skeleton, Table, Empty],
  templateUrl: "./sales.html",
  styleUrl: "./sales.css",
})
export class Sales {
  private readonly router = inject(Router);
  readonly screen = ScreenName.SALE;
  readonly list = listSales();
  readonly remover = deleteItem();
  readonly rows = computed<Row[]>(() =>
    this.list.filtered().map((sale) => ({
      ...sale, dateLabel: formatDateTime(sale.saleDate), totalLabel: formatMoney(sale.total), lines: sale.items.length,
    }))
  );

  create(): void { void this.router.navigate([PrivateRoutes.SALES, "nueva"]); }
  open(row: Row): void { void this.router.navigate([PrivateRoutes.SALES, row["id"]]); }
  remove(row: Row): void { this.remover.remove(this.screen, Number(row["id"])); }
}
