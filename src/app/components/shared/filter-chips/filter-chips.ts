import { Component, input, model } from "@angular/core";

export interface FilterOption { value: string; label: string; }

/**
 * Un grupo de filtros como chips excluyentes con un "Todos" delante. El valor es la cadena de
 * la opción o null (sin filtro). Varias dimensiones = varios grupos, uno por componente.
 */
@Component({
  selector: "app-filter-chips",
  template: `
    <div class="group" role="group" [attr.aria-label]="label()">
      @if (label()) { <span class="label">{{ label() }}</span> }
      <button type="button" class="chip" [class.active]="value() === null" (click)="value.set(null)">Todos</button>
      @for (option of options(); track option.value) {
        <button type="button" class="chip" [class.active]="value() === option.value" (click)="value.set(option.value)" [attr.aria-pressed]="value() === option.value">{{ option.label }}</button>
      }
    </div>
  `,
  styles: `
    .group { display: flex; align-items: center; flex-wrap: wrap; gap: 0.6rem; }
    .label { font-size: 1.2rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-right: 0.4rem; }
    .chip { padding: 0.5rem 1.2rem; border-radius: 99rem; border: 1px solid var(--border-color); background-color: var(--main-color); color: var(--text-muted); font-size: 1.3rem; font-weight: 500; transition: background-color .15s ease, color .15s ease, border-color .15s ease; }
    .chip:hover { background-color: var(--white-one); color: var(--text-color); }
    .chip.active { background-color: var(--blue-soft); border-color: var(--blue-soft); color: var(--blue-dark); }
  `,
})
export class FilterChips {
  readonly label = input("");
  readonly options = input.required<FilterOption[]>();
  readonly value = model<string | null>(null);
}
