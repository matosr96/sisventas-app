import { Component, input, output } from "@angular/core";

/**
 * Diálogo sobre un fondo. `variant="modal"` (centrado) para tareas cortas: confirmar, crear con pocos
 * campos. `variant="drawer"` (panel lateral derecho) cuando se edita un registro y conviene seguir
 * viendo la lista detrás, o cuando el formulario es largo.
 */
@Component({
  selector: "app-modal",
  templateUrl: "./modal.html",
  styleUrl: "./modal.css",
})
export class Modal {
  readonly open = input.required<boolean>();
  readonly title = input("");
  readonly subtitle = input("");
  readonly size = input<"md" | "lg">("md");
  readonly variant = input<"modal" | "drawer">("modal");
  readonly closed = output<void>();

  /** Cierra solo si el clic fue sobre el fondo, no dentro del diálogo. */
  onOverlay(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closed.emit();
  }
}
