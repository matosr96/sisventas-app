import { Component, input, model, output } from "@angular/core";
import { Breadcrumbs } from "../breadcrumbs/breadcrumbs";
import { ButtonCnt } from "../button/button";
import { Search } from "../search/search";

/** Cabecera de pantalla de listado: título, migas, búsqueda y botón de crear (oculto si nameButton está vacío). */
@Component({
  selector: "app-header-page",
  imports: [Breadcrumbs, ButtonCnt, Search],
  templateUrl: "./header-page.html",
  styleUrl: "./header-page.css",
})
export class HeaderPage {
  readonly title = input.required<string>();
  readonly icon = input("bx-grid-alt");
  readonly items = input<string[]>([]);
  readonly nameButton = input("");
  readonly searchable = input(true);
  readonly searchTerm = model("");
  readonly create = output<void>();
}
