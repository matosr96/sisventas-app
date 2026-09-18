import { Component, input } from "@angular/core";

/**
 * Indicador de Inicio: cifra grande, etiqueta y una línea de contexto (periodo o comparación).
 * `delta` pinta la variación con flecha y color: verde sube, rojo baja; null = sin comparación.
 */
@Component({
  selector: "app-metric-card",
  template: `
    <article class="card" [class.warn]="tone() === 'warn'" [class.ok]="tone() === 'ok'">
      <i class="bx icon" [class]="'bx icon ' + icon()"></i>
      <div class="body">
        <span class="label">{{ label() }}</span>
        <span class="value">{{ value() }}</span>
        <span class="hint">
          @if (delta() !== null) {
            <span class="delta" [class.up]="delta()! > 0" [class.down]="delta()! < 0">
              <i class="bx" [class]="'bx ' + (delta()! > 0 ? 'bx-up-arrow-alt' : delta()! < 0 ? 'bx-down-arrow-alt' : 'bx-minus')"></i>{{ delta()! > 0 ? '+' : '' }}{{ delta() }}%
            </span>
          }
          {{ hint() }}
        </span>
      </div>
    </article>
  `,
  styles: `
    .card { display: flex; align-items: flex-start; gap: 1.6rem; padding: 2rem; background-color: var(--main-color); border-radius: var(--radius); box-shadow: var(--box-shadow); }
    .icon { font-size: 2.4rem; padding: 1.1rem; border-radius: var(--radius-sm); background-color: var(--blue-soft); color: var(--blue-dark); }
    .warn .icon { background-color: var(--amber-soft); color: var(--amber-dark); }
    .ok .icon { background-color: var(--green-soft); color: var(--green-dark); }
    .body { display: flex; flex-direction: column; gap: 0.2rem; min-width: 0; }
    .label { font-size: 1.3rem; font-weight: 500; color: var(--text-muted); }
    .value { font-size: 2.6rem; font-weight: 700; line-height: 1.2; letter-spacing: -0.01em; }
    .hint { display: flex; align-items: center; gap: 0.6rem; font-size: 1.2rem; color: var(--text-muted); }
    .hint:empty { display: none; }
    .delta { display: inline-flex; align-items: center; font-weight: 600; padding: 0.1rem 0.5rem; border-radius: 0.4rem; background-color: var(--white-two); }
    .delta i { font-size: 1.4rem; }
    .up { color: var(--green-dark); background-color: var(--green-soft); }
    .down { color: var(--red-dark); background-color: var(--red-soft); }
  `,
})
export class MetricCard {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input("bx-stats");
  readonly tone = input<"neutral" | "warn" | "ok">("neutral");
  readonly hint = input("");
  readonly delta = input<number | null>(null);
}
