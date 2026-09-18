import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { ConfirmDialog, Toaster } from "./components/shared";
import { session } from "./operations/session/session";
import { UiStore } from "./store/ui";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, Toaster, ConfirmDialog],
  template: `<app-toaster /><app-confirm-dialog /><router-outlet />`,
})
export class App {
  // Inyectar el store aquí aplica el tema al <html> desde el arranque.
  private readonly ui = inject(UiStore);

  constructor() {
    session(); // refresca usuario y configuración, vigila la caducidad del token y recarga al volver a la pestaña
  }
}
