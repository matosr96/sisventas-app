import { Component, computed } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Empty, Table, badge, type Row } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { DateRangePicker, FilterChips, HeaderPage, Skeleton, type DateRange, type FilterOption } from "../../components/shared";
import { PrivateRoutes, ScreenName } from "../../constants";
import { StockMovementType, movementTypeLabel } from "../../entities";
import { listAllMovements } from "../../operations/inventory/list-all-movements";
import { dayRangeToInstants, formatDateTime } from "../../utils";

/** Libro de stock de todos los productos: cada asiento con su saldo, filtrable por tipo y fechas. */
@Component({
  selector: "app-inventory",
  imports: [Layout, HeaderPage, Skeleton, Table, Empty, FilterChips, DateRangePicker, RouterLink],
  template: `
    <app-layout>
      <app-header-page title="Inventario" icon="bx-book" [items]="['Inicio', 'Inventario']" [searchable]="false">
        <a actions class="link" [routerLink]="routes.PRODUCTS">Ver catálogo</a>
        <ng-container filters>
          <app-date-range [value]="range()" (valueChange)="setRange($event)" />
          <app-filter-chips label="Movimiento" [options]="typeOptions" [value]="typeFilter()" (valueChange)="list.setFilter('type', $event)" />
        </ng-container>
      </app-header-page>
      @if (list.isLoading()) { <app-skeleton /> }
      @else if (list.isError()) { <p class="error">No se pudo cargar el libro de stock. Reintenta en unos segundos.</p> }
      @else if (list.count() === 0 && !list.hasFilters()) {
        <app-empty title="Inventario" copy="Todavía no hay movimientos: aparecen al crear productos, comprar, vender o ajustar." />
      } @else if (list.count() === 0) {
        <app-empty variant="no-results" (clear)="list.clearFilters()" />
      } @else {
        <app-table [data]="rows()" [headers]="['Fecha', 'Producto', 'Movimiento', 'Cantidad', 'Saldo', 'Referencia']"
          [keys]="['createdAt', 'product', 'type', 'quantity', 'stockAfter', 'reference']" [numericKeys]="['quantity', 'stockAfter']" [screenName]="screen" [actions]="false"
          [total]="list.count()" [query]="list.tableQuery()" [sortableKeys]="['createdAt', 'quantity']" (queryChange)="list.onQuery($event)" />
      }
    </app-layout>
  `,
  styles: `
    .link { font-weight: 600; color: var(--blue-bg); }
    .error { padding: 2rem; border-radius: var(--radius); background-color: var(--red-soft); color: var(--red-dark); }
  `,
})
export class Inventory {
  readonly screen = ScreenName.MOVEMENT;
  readonly routes = PrivateRoutes;
  readonly list = listAllMovements();
  readonly typeOptions: FilterOption[] = Object.values(StockMovementType).map((type) => ({ value: type, label: movementTypeLabel(type) }));
  readonly typeFilter = computed(() => this.list.filters()["type"] ?? null);
  readonly range = computed<DateRange>(() => ({ from: this.list.filters()["fromDay"] ?? null, to: this.list.filters()["toDay"] ?? null }));
  readonly rows = computed<Row[]>(() =>
    this.list.items().map((movement) => ({
      ...movement,
      createdAt: formatDateTime(movement.createdAt),
      product: `${movement.productName} · ${movement.productSku}`,
      type: badge(movementTypeLabel(movement.type), movement.quantity > 0 ? "ok" : "warn"),
      quantity: `${movement.quantity > 0 ? "+" : ""}${movement.quantity}`,
      reference: movement.reference || movement.reason || "",
    }))
  );

  setRange(range: DateRange): void {
    const instants = dayRangeToInstants(range.from, range.to);
    this.list.setFilters({ fromDay: range.from, toDay: range.to, from: instants.from, to: instants.to });
  }
}
