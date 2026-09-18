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

  /** Libro de stock y auditoría son inmutables: ninguna acción de fila. */
  private readonly readOnly = computed(() => this.screenName() === ScreenName.MOVEMENT || this.screenName() === ScreenName.AUDIT);
  readonly canEdit = computed(() =>
    !this.readOnly() && this.screenName() !== ScreenName.SALE && this.screenName() !== ScreenName.PURCHASE && this.auth.isAdmin()
  );
  // Los usuarios no se borran: se desactivan desde su edición. Sin botón que no haga nada.
  readonly canDelete = computed(() => !this.readOnly() && this.screenName() !== ScreenName.USER && this.auth.isAdmin());
  readonly removeLabel = computed(() =>
    this.screenName() === ScreenName.SALE || this.screenName() === ScreenName.PURCHASE ? "Anular" : "Eliminar"
  );
}
