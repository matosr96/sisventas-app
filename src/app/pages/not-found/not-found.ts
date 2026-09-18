import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { Logo } from "../../components/shared";
import { PrivateRoutes } from "../../constants";

@Component({
  selector: "app-not-found",
  imports: [RouterLink, Logo],
  template: `
    <main class="page">
      <app-logo variant="mark" size="lg" />
      <h1 class="title">Esta página no existe.</h1>
      <a class="link" [routerLink]="home">Volver al inicio</a>
    </main>
  `,
  styles: `
    .page { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.6rem; }
    .title { font-size: 2rem; font-weight: 600; }
    .link { color: var(--blue-bg); font-weight: 600; }
  `,
})
export class NotFound {
  readonly home = PrivateRoutes.HOME;
}
