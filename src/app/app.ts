import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Toaster } from "./components/shared";
import { UiStore } from "./store/ui";

@Component({
  selector: "app-root",
  imports: [RouterOutlet, Toaster],
  template: `<app-toaster /><router-outlet />`,
})
export class App {
  // Inyectar el store aquí aplica el tema al <html> desde el arranque.
  private readonly ui = inject(UiStore);
}
