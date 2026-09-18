import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Logo } from "../../components/shared";
import { PrivateRoutes } from "../../constants";

/** Adonde manda roleGuard: explica, en vez de devolver a Inicio en silencio. */
@Component({
  selector: "app-forbidden",
  imports: [RouterLink, Logo],
  template: `
    <main class="page">
      <app-logo variant="mark" size="lg" />
      <h1 class="title">No tienes permiso para ver esta página.</h1>
      <p class="copy">Esta sección es solo para administradores. Si crees que deberías verla, pide a un administrador que cambie tu rol.</p>
      <a class="link" [routerLink]="home">Volver al inicio</a>
    </main>
  `,
  styles: `
    .page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.2rem; padding: 2rem; text-align: center; }
    .title { font-size: 2rem; font-weight: 600; }
    .copy { color: var(--text-muted); max-width: 46rem; }
    .link { color: var(--blue-bg); font-weight: 600; }
  `,
})
export class Forbidden {
  readonly home = PrivateRoutes.HOME;
}
