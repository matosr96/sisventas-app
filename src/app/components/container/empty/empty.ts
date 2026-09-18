import { Component, input, output } from "@angular/core";
import { ButtonCnt } from "../../shared/button/button";
import { Logo } from "../../shared/logo/logo";

/**
 * Dos vacíos distintos: `empty` (no hay datos: invita a crear el primero) y `no-results` (hay
 * datos, pero la búsqueda o los filtros no dejan ninguno: invita a limpiarlos, nunca a crear).
 */
@Component({
  selector: "app-empty",
  imports: [ButtonCnt, Logo],
  template: `
    <div class="empty">
      @if (variant() === "no-results") {
        <i class="bx bx-search-alt icon"></i>
        <h2 class="title">Sin resultados</h2>
        <p class="copy">Nada coincide con la búsqueda o los filtros aplicados.</p>
        <app-button name="Limpiar filtros" type="button" variant="ghost" icon="bx-x" (clicked)="clear.emit()" />
      } @else {
        <app-logo variant="mark" size="lg" />
        <h2 class="title">{{ title() }}</h2>
        <p class="copy">{{ copy() }}</p>
        @if (buttonName()) { <app-button [name]="buttonName()" type="button" icon="bx-plus" (clicked)="create.emit()" /> }
      }
    </div>
  `,
  styles: `
    .empty { display: flex; flex-direction: column; align-items: center; gap: 1.2rem; padding: 6rem 2rem; text-align: center; background-color: var(--main-color); border-radius: var(--radius); box-shadow: var(--box-shadow); }
    .icon { font-size: 4rem; color: var(--text-muted); }
    .title { font-size: 1.8rem; font-weight: 600; }
    .copy { color: var(--text-muted); max-width: 42rem; }
  `,
})
export class Empty {
  readonly variant = input<"empty" | "no-results">("empty");
  readonly title = input("");
  readonly copy = input("");
  readonly buttonName = input("");
  readonly create = output<void>();
  readonly clear = output<void>();
}
