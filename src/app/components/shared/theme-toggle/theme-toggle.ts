import { Component, inject } from "@angular/core";
import { ThemeModes, UiStore } from "../../../store/ui";

@Component({
  selector: "app-theme-toggle",
  template: `
    <div class="toggle" role="group" aria-label="Tema">
      @for (mode of modes; track mode.value) {
        <button type="button" [class.active]="ui.theme() === mode.value" (click)="ui.setTheme(mode.value)" [attr.aria-label]="mode.label" [title]="mode.label">
          <i class="bx" [class]="'bx ' + mode.icon"></i>
        </button>
      }
    </div>
  `,
  styles: `
    .toggle { display: inline-flex; gap: 0.2rem; padding: 0.3rem; border-radius: var(--radius); background-color: var(--white-two); }
    button { padding: 0.6rem 0.8rem; border-radius: 0.9rem; color: var(--text-muted); display: flex; transition: background-color .2s ease, color .2s ease; }
    button.active { background-color: var(--main-color); color: var(--blue-bg); box-shadow: var(--box-shadow); }
    i { font-size: 1.8rem; }
  `,
})
export class ThemeToggle {
  readonly ui = inject(UiStore);
  readonly modes = [
    { value: ThemeModes.LIGHT, label: "Claro", icon: "bx-sun" },
    { value: ThemeModes.DARK, label: "Oscuro", icon: "bx-moon" },
    { value: ThemeModes.SYSTEM, label: "Sistema", icon: "bx-desktop" },
  ] as const;
}
