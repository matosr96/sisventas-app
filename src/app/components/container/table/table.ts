import { Component, computed, input, output, signal } from "@angular/core";
import type { ScreenNameValue } from "../../../constants";
import { Actions } from "../actions/actions";

export type Row = Record<string, unknown>;

const PAGE_SIZE = 10;

/** headers y keys van en el mismo orden; los valores derivados se calculan con .map ANTES de pasarlos. */
@Component({
  selector: "app-table",
  imports: [Actions],
  templateUrl: "./table.html",
  styleUrl: "./table.css",
})
export class Table {
  readonly data = input.required<Row[]>();
  readonly headers = input.required<string[]>();
  readonly keys = input.required<string[]>();
  readonly screenName = input.required<ScreenNameValue>();
  readonly rowClick = output<Row>();
  readonly edit = output<Row>();
  readonly remove = output<Row>();

  readonly page = signal(1);
  readonly pages = computed(() => Math.max(1, Math.ceil(this.data().length / PAGE_SIZE)));
  readonly currentPage = computed(() => Math.min(this.page(), this.pages()));
  readonly rows = computed(() => {
    const start = (this.currentPage() - 1) * PAGE_SIZE;
    return this.data().slice(start, start + PAGE_SIZE);
  });

  render(value: unknown): string {
    if (value == null) return "";
    if (Array.isArray(value)) return value.join(", ");
    return String(value);
  }

  previous(): void { this.page.update((page) => Math.max(1, page - 1)); }
  next(): void { this.page.update((page) => Math.min(this.pages(), page + 1)); }
}
