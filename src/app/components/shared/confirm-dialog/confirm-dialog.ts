import { Component, ElementRef, effect, inject } from "@angular/core";
import { ButtonCnt } from "../button/button";
import { Confirm } from "./confirm";

/** Vive solo en App, como el toaster. Pinta lo que `Confirm.ask` tenga pendiente. */
@Component({
  selector: "app-confirm-dialog",
  imports: [ButtonCnt],
  template: `
    @if (confirm.pending(); as pending) {
      <div class="overlay" role="presentation" tabindex="-1" (click)="onOverlay($event)" (keydown.escape)="confirm.answer(false)">
        <div class="dialog" role="alertdialog" aria-modal="true" [attr.aria-label]="pending.title">
          <i class="bx icon" [class]="'bx icon ' + (pending.tone === 'danger' ? 'bx-error danger' : 'bx-help-circle')"></i>
          <h2 class="title">{{ pending.title }}</h2>
          <p class="message">{{ pending.message }}</p>
          <div class="actions">
            <app-button name="Cancelar" type="button" variant="ghost" (clicked)="confirm.answer(false)" />
            <app-button [name]="pending.confirmLabel ?? 'Confirmar'" type="button" [variant]="pending.tone === 'danger' ? 'danger' : 'primary'" (clicked)="confirm.answer(true)" />
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .overlay { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; background-color: var(--overlay); padding: 2rem; z-index: 60; }
    .dialog { width: 100%; max-width: 42rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; padding: 2.8rem 2.4rem 2.4rem; text-align: center; background-color: var(--main-color); border-radius: var(--radius); box-shadow: var(--box-shadow-md); }
    .icon { font-size: 3.6rem; color: var(--blue-bg); }
    .danger { color: var(--red-bg); }
    .title { font-size: 1.8rem; font-weight: 600; }
    .message { color: var(--text-muted); }
    .actions { display: flex; gap: 1.2rem; margin-top: 1.2rem; }
    @media (max-width: 768px) { .actions { flex-direction: column; width: 100%; } }
  `,
})
export class ConfirmDialog {
  readonly confirm = inject(Confirm);
  private readonly host = inject(ElementRef) as ElementRef<HTMLElement>;

  constructor() {
    // El foco entra al diálogo (en Cancelar, la opción segura) y vuelve donde estaba al cerrar.
    let previous: HTMLElement | null = null;
    effect(() => {
      if (this.confirm.pending()) {
        previous = document.activeElement as HTMLElement | null;
        queueMicrotask(() => (this.host.nativeElement.querySelector("button") as HTMLElement | null)?.focus());
      } else {
        previous?.focus();
        previous = null;
      }
    });
  }

  onOverlay(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.confirm.answer(false);
  }
}
