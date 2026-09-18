import { Component, computed, inject } from "@angular/core";
import { RouterLink } from "@angular/router";
import { MetricCard } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { HeaderPage, SelectCpt, Skeleton, type SelectOption } from "../../components/shared";
import { PrivateRoutes } from "../../constants";
import { paymentMethodLabel } from "../../entities";
import { cashClosing } from "../../operations/report/cash-closing";
import { listUsers } from "../../operations/user/list-users";
import { AuthStore } from "../../store/auth";
import { formatDate, formatMoney } from "../../utils";

/** Cierre de caja: lo cobrado en un día por método de pago, menos devoluciones. ADMIN puede verlo por vendedor. */
@Component({
  selector: "app-cash-closing",
  imports: [Layout, HeaderPage, Skeleton, MetricCard, SelectCpt, RouterLink],
  template: `
    <app-layout>
      <app-header-page title="Cierre de caja" icon="bx-wallet" [items]="['Inicio', 'Cierre de caja']" [searchable]="false">
        <a actions class="link" [routerLink]="routes.REPORTS"><i class="bx bx-bar-chart-alt-2"></i>Reportes</a>
        <ng-container filters>
          <label class="field"><span class="label">Día</span><input class="input" type="date" [value]="op.date()" [max]="today" (change)="op.date.set($any($event.target).value)" /></label>
          @if (auth.isAdmin()) {
            <div class="seller"><app-select name="userId" label="" placeholder="Todos los vendedores" [options]="sellerOptions()" [(value)]="op.userId" /></div>
          }
        </ng-container>
      </app-header-page>
      @if (op.isLoading()) { <app-skeleton variant="cards" /> }
      @else if (op.isError()) { <p class="error">No se pudo calcular el cierre. Reintenta en unos segundos.</p> }
      @else {
        @let closing = op.closing();
        <p class="period">Ventas del <strong>{{ formatDate(closing.from) }}</strong>@if (closing.userId) { de <strong>{{ sellerName(closing.userId) }}</strong> }</p>
        <section class="metrics">
          <app-metric-card label="Ventas" [value]="closing.saleCount" icon="bx-receipt" />
          <app-metric-card label="Cobrado" [value]="formatMoney(closing.total)" icon="bx-dollar-circle" tone="ok" />
          <app-metric-card label="Devuelto" [value]="formatMoney(closing.returned)" icon="bx-undo" [tone]="closing.returned > 0 ? 'warn' : 'neutral'" />
          <app-metric-card label="Neto en caja" [value]="formatMoney(closing.net)" icon="bx-wallet" tone="ok" />
        </section>
        <section class="panel">
          <h2 class="panel_title"><i class="bx bx-credit-card"></i>Por método de pago</h2>
          @if (closing.byPaymentMethod.length === 0) { <p class="muted">Sin ventas ese día.</p> }
          @else {
            <table class="table">
              <thead><tr><th>Método</th><th class="num">Ventas</th><th class="num">Total</th></tr></thead>
              <tbody>
                @for (row of closing.byPaymentMethod; track row.paymentMethod) {
                  <tr><td>{{ paymentMethodLabel(row.paymentMethod) }}</td><td class="num">{{ row.count }}</td><td class="num">{{ formatMoney(row.total) }}</td></tr>
                }
                <tr class="total_row"><td>Total</td><td class="num">{{ closing.saleCount }}</td><td class="num">{{ formatMoney(closing.total) }}</td></tr>
              </tbody>
            </table>
          }
          <p class="hint">El efectivo que debe haber en caja es el total en efectivo menos las devoluciones pagadas en efectivo; el resto ya está en el banco.</p>
        </section>
      }
    </app-layout>
  `,
  styles: `
    .link { display: inline-flex; align-items: center; gap: 0.6rem; font-weight: 600; color: var(--blue-bg); }
    .field { display: flex; align-items: center; gap: 0.6rem; }
    .label { font-size: 1.2rem; color: var(--text-muted); }
    .input { padding: 0.5rem 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background-color: var(--field-bg); color: var(--text-color); }
    .seller { min-width: 24rem; }
    .period { margin-bottom: 1.6rem; color: var(--text-muted); }
    .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1.6rem; margin-bottom: 1.6rem; }
    .panel { padding: 2rem; background-color: var(--main-color); border-radius: var(--radius); box-shadow: var(--box-shadow); }
    .panel_title { display: flex; align-items: center; gap: 0.8rem; font-size: 1.6rem; font-weight: 600; margin-bottom: 1.2rem; }
    .panel_title i { color: var(--blue-bg); }
    .table th, .table td { padding: 0.8rem 1rem; text-align: left; border-bottom: 1px solid var(--border-color); }
    .table th { font-size: 1.2rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; }
    .num { text-align: right; }
    .total_row { font-weight: 700; }
    .muted { color: var(--text-muted); }
    .hint { margin-top: 1.2rem; font-size: 1.3rem; color: var(--text-muted); }
    .error { padding: 2rem; border-radius: var(--radius); background-color: var(--red-soft); color: var(--red-dark); }
    @media (max-width: 768px) { .metrics { grid-template-columns: 1fr 1fr; } }
  `,
})
export class CashClosingPage {
  readonly auth = inject(AuthStore);
  readonly op = cashClosing();
  readonly routes = PrivateRoutes;
  readonly today = new Date().toISOString().slice(0, 10);
  readonly formatMoney = formatMoney;
  readonly formatDate = formatDate;
  readonly paymentMethodLabel = paymentMethodLabel;
  /** Solo ADMIN puede listar usuarios: para un vendedor la lista no se pide. */
  private readonly sellers = this.auth.isAdmin() ? listUsers({ limit: 100, sort: "name", dir: "asc" }) : null;
  readonly sellerOptions = computed<SelectOption<number>[]>(() =>
    (this.sellers?.items() ?? []).map((user) => ({ value: user.id, label: `${user.firstName} ${user.lastName}` }))
  );

  sellerName(id: number): string { return this.sellerOptions().find((option) => option.value === id)?.label ?? `#${id}`; }
}
