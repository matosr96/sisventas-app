import { Component, input } from '@angular/core';

@Component({
  selector: 'app-breadcrumbs',
  template: `
    <nav class="crumbs" aria-label="Ruta">
      @for (item of items(); track $index; let last = $last) {
        <span class="crumb" [class.current]="last">{{ item }}</span>
        @if (!last) {
          <i class="bx bx-chevron-right"></i>
        }
      }
    </nav>
  `,
  styles: `
    .crumbs {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: var(--text-muted);
      font-size: 1.3rem;
    }
    .current {
      color: var(--text-color);
      font-weight: 500;
    }
  `,
})
export class Breadcrumbs {
  readonly items = input.required<string[]>();
}
