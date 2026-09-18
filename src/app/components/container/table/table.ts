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

/**
 * headers y keys van en el mismo orden; los valores derivados se calculan con .map ANTES de pasarlos.
 * Orden por columna (clic en la cabecera), cabecera fija al hacer scroll, columnas numéricas a la
 * derecha (`numericKeys`) y paginación en cliente con tamaño elegible.
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
  readonly rowClick = output<Row>();
  readonly edit = output<Row>();
  readonly remove = output<Row>();

  readonly pageSizes = PAGE_SIZES;
  readonly pageSize = signal<number>(PAGE_SIZES[0]);
  readonly page = signal(1);
  readonly sortKey = signal<string | null>(null);
  readonly sortDirection = signal<"asc" | "desc">("asc");

  readonly sorted = computed(() => {
    const key = this.sortKey();
    if (!key) return this.data();
    const direction = this.sortDirection() === "asc" ? 1 : -1;
    return [...this.data()].sort((a, b) => compare(a[key], b[key]) * direction);
  });
  readonly pages = computed(() => Math.max(1, Math.ceil(this.data().length / this.pageSize())));
  readonly currentPage = computed(() => Math.min(this.page(), this.pages()));
  readonly rows = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    return this.sorted().slice(start, start + this.pageSize());
  });
  readonly rangeLabel = computed(() => {
    const total = this.data().length;
    const start = (this.currentPage() - 1) * this.pageSize() + 1;
    return `${start}–${Math.min(start + this.pageSize() - 1, total)} de ${total}`;
  });

  isBadge = isBadge;
  isNumeric(key: string): boolean { return this.numericKeys().includes(key); }

  render(value: unknown): string {
    if (value == null) return "";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  }

  sortBy(key: string): void {
    if (this.sortKey() === key) {
      this.sortDirection.update((direction) => (direction === "asc" ? "desc" : "asc"));
    } else {
      this.sortKey.set(key);
      this.sortDirection.set("asc");
    }
    this.page.set(1);
  }

  setPageSize(event: Event): void {
    this.pageSize.set(Number((event.target as HTMLSelectElement).value));
    this.page.set(1);
  }

  previous(): void { this.page.update((page) => Math.max(1, page - 1)); }
  next(): void { this.page.update((page) => Math.min(this.pages(), page + 1)); }
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
