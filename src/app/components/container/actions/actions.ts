import { Component, computed, inject, input, output } from "@angular/core";
import { ScreenName, type ScreenNameValue } from "../../../constants";
import { AuthStore } from "../../../store/auth";

/**
 * Único sitio donde se decide qué botones ve cada rol en una fila. El catálogo y los usuarios
 * los edita ADMIN; ventas y compras son documentos inmutables (se abren, no se editan) y anularlos es de ADMIN.
 */
@Component({
  selector: "app-actions",
  templateUrl: "./actions.html",
  styleUrl: "./actions.css",
})
export class Actions {
  private readonly auth = inject(AuthStore);

  readonly screenName = input.required<ScreenNameValue>();
  readonly edit = output<void>();
  readonly remove = output<void>();

  readonly canEdit = computed(() =>
    this.screenName() !== ScreenName.SALE && this.screenName() !== ScreenName.PURCHASE && this.auth.isAdmin()
  );
  readonly canDelete = computed(() => this.auth.isAdmin());
  readonly removeLabel = computed(() =>
    this.screenName() === ScreenName.SALE || this.screenName() === ScreenName.PURCHASE ? "Anular" : "Eliminar"
  );
}
