import { Component, computed, input, model } from "@angular/core";

export interface DateRange { from: string | null; to: string | null; }

const toIso = (date: Date): string => date.toISOString().slice(0, 10);
const daysAgo = (days: number): string => { const d = new Date(); d.setDate(d.getDate() - days); return toIso(d); };

/**
 * Rango de fechas (yyyy-MM-dd) con atajos: hoy, 7 días, 30 días, este mes. Emite `{ from, to }`
 * con null cuando no hay filtro. Es el patrón de todo listado de documentos.
 */
@Component({
  selector: "app-date-range",
  template: `
    <div class="range" role="group" aria-label="Rango de fechas">
      @for (preset of presets; track preset.label) {
        <button type="button" class="chip" [class.active]="isPreset(preset.from, preset.to)" (click)="value.set({ from: preset.from, to: preset.to })">{{ preset.label }}</button>
      }
      <label class="field"><span class="label">Desde</span><input class="input" type="date" [value]="value().from ?? ''" [max]="value().to ?? ''" (change)="set('from', $event)" /></label>
      <label class="field"><span class="label">Hasta</span><input class="input" type="date" [value]="value().to ?? ''" [min]="value().from ?? ''" (change)="set('to', $event)" /></label>
      @if (value().from || value().to) { <button type="button" class="clear" (click)="value.set({ from: null, to: null })" aria-label="Quitar fechas"><i class="bx bx-x"></i>Quitar</button> }
    </div>
  `,
  styles: `
    .range { display: flex; flex-wrap: wrap; align-items: center; gap: 0.6rem; }
    .chip { padding: 0.5rem 1.2rem; border-radius: 99rem; border: 1px solid var(--border-color); background-color: var(--main-color); color: var(--text-muted); font-size: 1.3rem; font-weight: 500; }
    .chip:hover { background-color: var(--white-one); color: var(--text-color); }
    .chip.active { background-color: var(--blue-soft); border-color: var(--blue-soft); color: var(--blue-dark); }
    .field { display: flex; align-items: center; gap: 0.6rem; margin-left: 0.6rem; }
    .label { font-size: 1.2rem; color: var(--text-muted); }
    .input { padding: 0.4rem 0.8rem; border-radius: var(--radius-sm); border: 1px solid var(--border-color); background-color: var(--field-bg); color: var(--text-color); font-size: 1.3rem; }
    .input:focus { outline: none; border-color: var(--blue-bg); box-shadow: 0 0 0 3px var(--blue-soft); }
    .clear { display: inline-flex; align-items: center; gap: 0.2rem; font-size: 1.3rem; color: var(--text-muted); padding: 0.4rem 0.6rem; border-radius: var(--radius-sm); }
    .clear:hover { background-color: var(--white-one); color: var(--text-color); }
  `,
})
export class DateRangePicker {
  readonly value = model<DateRange>({ from: null, to: null });
  readonly withPresets = input(true);
  readonly presets = [
    { label: "Hoy", from: toIso(new Date()), to: toIso(new Date()) },
    { label: "7 días", from: daysAgo(6), to: toIso(new Date()) },
    { label: "30 días", from: daysAgo(29), to: toIso(new Date()) },
    { label: "Este mes", from: toIso(new Date(new Date().getFullYear(), new Date().getMonth(), 1)), to: toIso(new Date()) },
  ];
  readonly active = computed(() => this.value());

  isPreset(from: string, to: string): boolean { return this.value().from === from && this.value().to === to; }

  set(key: keyof DateRange, event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.value.update((range) => ({ ...range, [key]: raw || null }));
  }
}
