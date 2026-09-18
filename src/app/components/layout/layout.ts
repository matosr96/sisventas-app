import { Component, inject } from "@angular/core";
import { UiStore } from "../../store/ui";
import { Sidebar } from "../sidebar/sidebar";

/** Shell privado: sidebar + contenido. Toda pantalla privada va dentro. */
@Component({
  selector: "app-layout",
  imports: [Sidebar],
  template: `
    <app-sidebar />
    <main class="main" [class.collapsed]="ui.sidebarCollapsed()">
      <button type="button" class="menu_button" (click)="ui.openSidebar()" aria-label="Abrir menú"><i class="bx bx-menu"></i></button>
      <div class="content"><ng-content /></div>
    </main>
  `,
  styles: `
    .main { margin-left: var(--sidebar-width); min-height: 100vh; transition: margin-left .2s ease; }
    .collapsed { margin-left: 7.2rem; }
    .content { padding: 3.2rem; max-width: 140rem; }
    .menu_button { display: none; }
    @media (max-width: 768px) {
      .main, .collapsed { margin-left: 0; }
      .content { padding: 2rem 1.6rem; }
      .menu_button { display: flex; margin: 1.2rem 1.6rem 0; font-size: 2.6rem; color: var(--text-color); }
    }
  `,
})
export class Layout {
  readonly ui = inject(UiStore);
}
