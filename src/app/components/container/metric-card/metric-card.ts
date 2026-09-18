import { Component, input } from "@angular/core";

@Component({
  selector: "app-metric-card",
  template: `
    <article class="card" [class.warn]="tone() === 'warn'" [class.ok]="tone() === 'ok'">
      <i class="bx icon" [class]="'bx icon ' + icon()"></i>
      <div class="body">
        <span class="label">{{ label() }}</span>
        <span class="value">{{ value() }}</span>
      </div>
    </article>
  `,
  styles: `
    .card { display: flex; align-items: center; gap: 1.6rem; padding: 2rem; background-color: var(--main-color); border-radius: var(--radius); box-shadow: var(--box-shadow); }
    .icon { font-size: 2.8rem; padding: 1.2rem; border-radius: 1rem; background-color: var(--blue-soft); color: var(--blue-dark); }
    .warn .icon { background-color: var(--amber-soft); color: var(--amber-dark); }
    .ok .icon { background-color: var(--green-soft); color: var(--green-dark); }
    .body { display: flex; flex-direction: column; }
    .label { font-size: 1.3rem; color: var(--text-muted); }
    .value { font-size: 2.4rem; font-weight: 700; }
  `,
})
export class MetricCard {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly icon = input("bx-stats");
  readonly tone = input<"neutral" | "warn" | "ok">("neutral");
}
