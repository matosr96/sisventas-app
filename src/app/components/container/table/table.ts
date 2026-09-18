import { Component, computed, input, output, signal } from "@angular/core";
import type { ScreenNameValue } from "../../../constants";
import { Badge, type BadgeTone } from "../../shared/badge/badge";
import { Actions } from "../actions/actions";

export type Row = Record<string, unknown>;

/** Celda de estado: la tabla la pinta como app-badge. Se construye en la pantalla con badge(). */
export interface BadgeCell { badge: string; tone: BadgeTone; }
export const badge = (label: string, tone: BadgeTone = "neutral"): BadgeCell => ({ badge: label, tone });
const isBadge = (value: unknown): value is BadgeCell => typeof value === "object" && value !== null && "badge" in value;

const PAGE_SIZES = [10, 25, 50] as const;

/** Estado de paginación y orden que la tabla emite en modo servidor. */
export interface TableQuery { page: number; limit: number; sort: string | null; dir: "asc" | "desc"; }

/**
 * headers y keys van en el mismo orden; los valores derivados se calculan con .map ANTES de pasarlos.
 * Orden por columna (clic en la cabecera), cabecera fija al hacer scroll y columnas numéricas a la
 * derecha (`numericKeys`). Dos modos: sin `total` ordena y pagina en cliente; con `total` (modo
 * servidor) solo pinta la página recibida y emite `queryChange` para que la operación recargue.
 */
@Component({
  selector: "app-table",
  imports: [Actions, Badge],
  templateUrl: "./table.html",
  styleUrl: "./table.css",
})
export class Table {
  readonly data = input.required<Row[]>();
  readonly headers = input.required<string[]>();
  readonly keys = input.required<string[]>();
  readonly numericKeys = input<string[]>([]);
  readonly screenName = input.required<ScreenNameValue>();
  /** Modo servidor: total de registros y consulta actual; la tabla deja de ordenar y paginar por su cuenta. */
  readonly total = input<number | null>(null);
  readonly query = input<TableQuery | null>(null);
  /** Claves que no admiten orden (en modo servidor, las que la API no sabe ordenar). */
  readonly sortableKeys = input<string[] | null>(null);
  /** false en listados inmutables (libro, auditoría): sin columna de acciones. */
  readonly actions = input(true);
  readonly rowClick = output<Row>();
  readonly edit = output<Row>();
  readonly remove = output<Row>();
  readonly queryChange = output<TableQuery>();

  readonly pageSizes = PAGE_SIZES;
  private readonly localPageSize = signal<number>(PAGE_SIZES[0]);
  private readonly localPage = signal(1);
  private readonly localSortKey = signal<string | null>(null);
  private readonly localSortDirection = signal<"asc" | "desc">("asc");

  readonly isServer = computed(() => this.total() !== null);
  readonly pageSize = computed(() => this.query()?.limit ?? this.localPageSize());
  readonly sortKey = computed(() => (this.isServer() ? this.query()?.sort ?? null : this.localSortKey()));
  readonly sortDirection = computed(() => (this.isServer() ? this.query()?.dir ?? "desc" : this.localSortDirection()));

  readonly sorted = computed(() => {
    const key = this.sortKey();
    if (this.isServer() || !key) return this.data();
    const direction = this.sortDirection() === "asc" ? 1 : -1;
    return [...this.data()].sort((a, b) => compare(a[key], b[key]) * direction);
  });
  readonly count = computed(() => this.total() ?? this.data().length);
  readonly pages = computed(() => Math.max(1, Math.ceil(this.count() / this.pageSize())));
  readonly currentPage = computed(() => Math.min(this.query()?.page ?? this.localPage(), this.pages()));
  readonly rows = computed(() => {
    if (this.isServer()) return this.data();
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.sorted().slice(start, start + this.pageSize());
  });
  readonly rangeLabel = computed(() => {
    const total = this.count();
    if (total === 0) return "Sin registros";
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    return `${start}–${Math.min(start + this.pageSize() - 1, total)} de ${total}`;
  });

  isBadge = isBadge;
  isNumeric(key: string): boolean { return this.numericKeys().includes(key); }
  isSortable(key: string): boolean { const keys = this.sortableKeys(); return keys === null || keys.includes(key); }

  render(value: unknown): string {
    if (value == null) return "";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  }

  sortBy(key: string): void {
    if (!this.isSortable(key)) return;
    const dir = this.sortKey() === key ? (this.sortDirection() === "asc" ? "desc" : "asc") : "asc";
    this.apply({ sort: key, dir, page: 1 });
  }

  setPageSize(event: Event): void {
    this.apply({ limit: Number((event.target as HTMLSelectElement).value), page: 1 });
  }

  previous(): void { this.apply({ page: Math.max(1, this.currentPage() - 1) }); }
  next(): void { this.apply({ page: Math.min(this.pages(), this.currentPage() + 1) }); }

  /** En servidor se emite y la operación decide; en cliente se aplica al estado local. */
  private apply(patch: Partial<TableQuery>): void {
    if (this.isServer()) {
      const current = this.query() ?? { page: 1, limit: this.pageSize(), sort: null, dir: "desc" as const };
      this.queryChange.emit({ ...current, ...patch });
      return;
    }
    if (patch.sort !== undefined) this.localSortKey.set(patch.sort);
    if (patch.dir !== undefined) this.localSortDirection.set(patch.dir);
    if (patch.limit !== undefined) this.localPageSize.set(patch.limit);
    if (patch.page !== undefined) this.localPage.set(patch.page);
  }
}

/** Números por valor, badges por su texto, el resto como texto con orden natural (es). */
function compare(a: unknown, b: unknown): number {
  const left = isBadge(a) ? a.badge : a;
  const right = isBadge(b) ? b.badge : b;
  if (left == null) return right == null ? 0 : 1;
  if (right == null) return -1;
  if (typeof left === "number" && typeof right === "number") return left - right;
  return String(left).localeCompare(String(right), "es", { numeric: true, sensitivity: "base" });
}
