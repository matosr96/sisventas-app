import { Component, computed, input } from "@angular/core";

export interface BarPoint { label: string; value: number; hint?: string; }

/** Gráfica de barras en SVG a mano (regla del proyecto: sin librerías). Colores por variable de tema. */
@Component({
  selector: "app-bar-chart",
  template: `
    <figure class="chart" [attr.aria-label]="title()">
      @if (title()) { <figcaption class="caption">{{ title() }}</figcaption> }
      @if (points().length === 0) {
        <p class="empty">Sin datos en el periodo.</p>
      } @else {
        <svg class="svg" [attr.viewBox]="'0 0 ' + width + ' ' + height" preserveAspectRatio="none" role="img">
          @for (line of gridLines(); track line.y) {
            <line class="grid" x1="0" [attr.x2]="width" [attr.y1]="line.y" [attr.y2]="line.y" />
            <text class="tick" x="0" [attr.y]="line.y - 2">{{ line.label }}</text>
          }
          @for (bar of bars(); track bar.x) {
            <rect class="bar" [attr.x]="bar.x" [attr.y]="bar.y" [attr.width]="bar.width" [attr.height]="bar.height" rx="2"><title>{{ bar.hint }}</title></rect>
          }
        </svg>
        <div class="labels">
          @for (bar of bars(); track bar.x) { <span class="label" [style.left.%]="bar.center">{{ bar.label }}</span> }
        </div>
      }
    </figure>
  `,
  styles: `
    .chart { display: flex; flex-direction: column; gap: 0.6rem; width: 100%; }
    .caption { font-size: 1.3rem; font-weight: 600; color: var(--text-muted); }
    .svg { width: 100%; height: 18rem; overflow: visible; }
    .grid { stroke: var(--border-color); stroke-width: 1; vector-effect: non-scaling-stroke; }
    .tick { font-size: 9px; fill: var(--text-muted); }
    .bar { fill: var(--blue-bg); transition: fill .15s ease; }
    .bar:hover { fill: var(--blue-dark); }
    .labels { position: relative; height: 1.6rem; }
    .label { position: absolute; transform: translateX(-50%); font-size: 1.1rem; color: var(--text-muted); white-space: nowrap; }
    .empty { padding: 2rem; text-align: center; color: var(--text-muted); }
  `,
})
export class BarChart {
  readonly points = input.required<BarPoint[]>();
  readonly title = input("");
  readonly format = input<(value: number) => string>((value) => String(value));
  readonly width = 600;
  readonly height = 200;

  private readonly max = computed(() => Math.max(1, ...this.points().map((point) => point.value)));

  readonly bars = computed(() => {
    const points = this.points();
    const slot = this.width / Math.max(1, points.length);
    const barWidth = Math.min(48, Math.max(4, slot * 0.6)); // una sola barra no ocupa toda la gráfica
    // Las etiquetas del eje se reparten para no amontonarse: como mucho una cada n barras.
    const every = Math.max(1, Math.ceil(points.length / 12));
    return points.map((point, i) => {
      const height = (point.value / this.max()) * (this.height - 20);
      return {
        x: i * slot + (slot - barWidth) / 2, y: this.height - height, width: barWidth, height,
        center: ((i + 0.5) / points.length) * 100,
        label: i % every === 0 ? point.label : "",
        hint: point.hint ?? `${point.label}: ${this.format()(point.value)}`,
      };
    });
  });

  readonly gridLines = computed(() => {
    const steps = 4;
    return Array.from({ length: steps }, (_, i) => {
      const value = (this.max() / steps) * (steps - i);
      return { y: 20 + ((this.height - 20) / steps) * i, label: this.format()(Math.round(value)) };
    });
  });
}
