import { Component, computed, inject } from "@angular/core";
import { Router } from "@angular/router";
import { Empty, Table, badge, type Row } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { DateRangePicker, FilterChips, HeaderPage, Skeleton, type DateRange, type FilterOption } from "../../components/shared";
import { PrivateRoutes, ScreenName } from "../../constants";
import { PaymentMethod, paymentMethodLabel } from "../../entities";
import { deleteItem } from "../../operations/delete-item";
import { listSales } from "../../operations/sale/list-sales";
import { dayRangeToInstants, formatDateTime, formatMoney } from "../../utils";

@Component({
  selector: "app-sales",
  imports: [Layout, HeaderPage, Skeleton, Table, Empty, FilterChips, DateRangePicker],
  templateUrl: "./sales.html",
  styleUrl: "./sales.css",
})
export class Sales {
  private readonly router = inject(Router);
  readonly screen = ScreenName.SALE;
  readonly list = listSales();
  readonly remover = deleteItem();
  readonly paymentOptions: FilterOption[] = [
    { value: PaymentMethod.CASH, label: "Efectivo" }, { value: PaymentMethod.CARD, label: "Tarjeta" }, { value: PaymentMethod.TRANSFER, label: "Transferencia" },
  ];
  readonly paymentFilter = computed(() => this.list.filters()["paymentMethod"] ?? null);
  readonly range = computed<DateRange>(() => ({ from: this.list.filters()["fromDay"] ?? null, to: this.list.filters()["toDay"] ?? null }));
  readonly rows = computed<Row[]>(() =>
    this.list.items().map((sale) => ({
      ...sale,
      number: sale.saleNumber,
      date: formatDateTime(sale.saleDate),
      lines: sale.items.length,
      payment: badge(paymentMethodLabel(sale.paymentMethod), sale.paymentMethod === PaymentMethod.CASH ? "ok" : "info"),
      total: formatMoney(sale.total),
    }))
  );

  /** Los días del selector se guardan aparte (fromDay/toDay) y se traducen a instantes para la API. */
  setRange(range: DateRange): void {
    const instants = dayRangeToInstants(range.from, range.to);
    this.list.setFilters({ fromDay: range.from, toDay: range.to, from: instants.from, to: instants.to });
  }
  create(): void { void this.router.navigate([PrivateRoutes.SALES, "nueva"]); }
  open(row: Row): void { void this.router.navigate([PrivateRoutes.SALES, row["id"]]); }
  remove(row: Row): void { void this.remover.remove(this.screen, Number(row["id"])); }
}
