import { Component, computed } from "@angular/core";
import { Empty, Table, badge, type Row } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { DateRangePicker, FilterChips, HeaderPage, Skeleton, type DateRange, type FilterOption } from "../../components/shared";
import { ScreenName } from "../../constants";
import { listAudits } from "../../operations/audit/list-audits";
import { dayRangeToInstants, formatDateTime } from "../../utils";

const MethodLabels: Record<string, string> = { POST: "Creó", PUT: "Modificó", PATCH: "Modificó", DELETE: "Eliminó" };

/** Toda escritura exitosa que registró la API: quién, qué y cuándo. Solo ADMIN; solo lectura. */
@Component({
  selector: "app-audits",
  imports: [Layout, HeaderPage, Skeleton, Table, Empty, FilterChips, DateRangePicker],
  template: `
    <app-layout>
      <app-header-page title="Auditoría" icon="bx-shield-quarter" [items]="['Inicio', 'Auditoría']" searchPlaceholder="Recurso (/api/v1/sales…)" [(searchTerm)]="resourceTerm">
        <ng-container filters>
          <app-date-range [value]="range()" (valueChange)="setRange($event)" />
          <app-filter-chips label="Acción" [options]="methodOptions" [value]="methodFilter()" (valueChange)="list.setFilter('method', $event)" />
        </ng-container>
      </app-header-page>
      @if (list.isLoading()) { <app-skeleton /> }
      @else if (list.isError()) { <p class="error">No se pudo cargar la auditoría. Reintenta en unos segundos.</p> }
      @else if (list.count() === 0 && !list.hasFilters()) {
        <app-empty title="Auditoría" copy="Aquí aparecerá cada escritura que haga cualquier usuario." />
      } @else if (list.count() === 0) {
        <app-empty variant="no-results" (clear)="list.clearFilters()" />
      } @else {
        <app-table [data]="rows()" [headers]="['Fecha', 'Usuario', 'Acción', 'Recurso', 'Detalle']"
          [keys]="['createdAt', 'username', 'method', 'resource', 'detail']" [screenName]="screen" [actions]="false"
          [total]="list.count()" [query]="list.tableQuery()" [sortableKeys]="['createdAt', 'username']" (queryChange)="list.onQuery($event)" />
      }
    </app-layout>
  `,
  styles: `.error { padding: 2rem; border-radius: var(--radius); background-color: var(--red-soft); color: var(--red-dark); }`,
})
export class Audits {
  readonly screen = ScreenName.AUDIT;
  readonly list = listAudits();
  /** La API filtra "resource" por contiene; se enlaza al buscador de la cabecera. */
  readonly resourceTerm = this.list.searchTerm;
  readonly methodOptions: FilterOption[] = [
    { value: "POST", label: "Creaciones" }, { value: "PUT", label: "Modificaciones" }, { value: "DELETE", label: "Eliminaciones" },
  ];
  readonly methodFilter = computed(() => this.list.filters()["method"] ?? null);
  readonly range = computed<DateRange>(() => ({ from: this.list.filters()["fromDay"] ?? null, to: this.list.filters()["toDay"] ?? null }));
  readonly rows = computed<Row[]>(() =>
    this.list.items().map((audit) => ({
      ...audit,
      createdAt: formatDateTime(audit.createdAt),
      method: badge(MethodLabels[audit.method] ?? audit.method, audit.method === "DELETE" ? "danger" : audit.method === "POST" ? "ok" : "info"),
      resource: audit.resource.replace("/api/v1", ""),
      detail: audit.detail ?? "",
    }))
  );

  setRange(range: DateRange): void {
    const instants = dayRangeToInstants(range.from, range.to);
    this.list.setFilters({ fromDay: range.from, toDay: range.to, from: instants.from, to: instants.to });
  }
}
