import { Component, inject } from "@angular/core";
import { Toast, type ToastMessage } from "./toast";

/** Vive solo en App. Arriba a la derecha. */
@Component({
  selector: "app-toaster",
  templateUrl: "./toaster.html",
  styleUrl: "./toaster.css",
})
export class Toaster {
  readonly toast = inject(Toast);

  run(message: ToastMessage, action: { onClick: () => void } | undefined): void {
    action?.onClick();
    this.toast.dismiss(message.id);
  }
}
