import { Component, input, output } from "@angular/core";
import { ButtonCnt } from "../../shared/button/button";
import { Logo } from "../../shared/logo/logo";

@Component({
  selector: "app-empty",
  imports: [ButtonCnt, Logo],
  template: `
    <div class="empty">
      <app-logo variant="mark" size="lg" />
      <h2 class="title">{{ title() }}</h2>
      <p class="copy">{{ copy() }}</p>
      @if (buttonName()) { <app-button [name]="buttonName()" type="button" icon="bx-plus" (clicked)="create.emit()" /> }
    </div>
  `,
  styles: `
    .empty { display: flex; flex-direction: column; align-items: center; gap: 1.2rem; padding: 6rem 2rem; text-align: center; background-color: var(--main-color); border-radius: var(--radius); box-shadow: var(--box-shadow); }
    .title { font-size: 1.8rem; font-weight: 600; }
    .copy { color: var(--text-muted); max-width: 42rem; }
  `,
})
export class Empty {
  readonly title = input.required<string>();
  readonly copy = input("");
  readonly buttonName = input("");
  readonly create = output<void>();
}
