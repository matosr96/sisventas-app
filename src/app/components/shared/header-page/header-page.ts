import { Component, input, model, output } from "@angular/core";
import { Badge, type BadgeTone } from "../badge/badge";
import { Breadcrumbs } from "../breadcrumbs/breadcrumbs";
import { ButtonCnt } from "../button/button";
import { Search } from "../search/search";

/**
 * Cabecera de pantalla: título (con badge de estado opcional), migas, búsqueda y botón de crear
 * (oculto si nameButton está vacío). Dos huecos: `[actions]` para botones propios de la pantalla
 * (junto al de crear) y `[filters]` para la fila de chips bajo el título.
 */
@Component({
  selector: "app-header-page",
  imports: [Breadcrumbs, ButtonCnt, Search, Badge],
  templateUrl: "./header-page.html",
  styleUrl: "./header-page.css",
})
export class HeaderPage {
  readonly title = input.required<string>();
  readonly icon = input("bx-grid-alt");
  readonly items = input<string[]>([]);
  readonly badge = input("");
  readonly badgeTone = input<BadgeTone>("neutral");
  readonly nameButton = input("");
  readonly searchable = input(true);
  readonly searchPlaceholder = input("Buscar…");
  readonly resultCount = input<number | null>(null);
  readonly searchTerm = model("");
  readonly create = output<void>();
}
