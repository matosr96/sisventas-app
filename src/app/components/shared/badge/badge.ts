import { Component, input } from '@angular/core';

export type BadgeTone = 'neutral' | 'ok' | 'warn' | 'danger' | 'info';

/** Estado como etiqueta de color (fondo --*-soft, texto --*-dark): se lee de un vistazo, no hay que leer la palabra. */
@Component({
  selector: 'app-badge',
  template: `<span class="badge" [class]="'badge ' + tone()"
    ><span class="dot"></span>{{ label() }}</span
  >`,
  styles: `
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.3rem 0.9rem;
      border-radius: 99rem;
      font-size: 1.2rem;
      font-weight: 600;
      line-height: 1.5;
      white-space: nowrap;
      background-color: var(--white-two);
      color: var(--text-muted);
    }
    .dot {
      width: 0.6rem;
      height: 0.6rem;
      border-radius: 50%;
      background-color: currentColor;
    }
    .ok {
      background-color: var(--green-soft);
      color: var(--green-dark);
    }
    .warn {
      background-color: var(--amber-soft);
      color: var(--amber-dark);
    }
    .danger {
      background-color: var(--red-soft);
      color: var(--red-dark);
    }
    .info {
      background-color: var(--blue-soft);
      color: var(--blue-dark);
    }
  `,
})
export class Badge {
  readonly label = input.required<string>();
  readonly tone = input<BadgeTone>('neutral');
}
