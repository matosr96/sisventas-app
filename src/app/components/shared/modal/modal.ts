import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-modal",
  templateUrl: "./modal.html",
  styleUrl: "./modal.css",
})
export class Modal {
  readonly open = input.required<boolean>();
  readonly title = input("");
  readonly size = input<"md" | "lg">("md");
  readonly closed = output<void>();

  /** Cierra solo si el clic fue sobre el fondo, no dentro del diálogo. */
  onOverlay(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closed.emit();
  }
}
