import { Component, input, output } from "@angular/core";

@Component({
  selector: "app-button",
  templateUrl: "./button.html",
  styleUrl: "./button.css",
})
export class ButtonCnt {
  readonly name = input.required<string>();
  readonly type = input<"submit" | "button">("submit");
  readonly variant = input<"primary" | "ghost" | "danger">("primary");
  readonly icon = input("");
  readonly size = input<"md" | "lg">("md");
  readonly disabled = input(false);
  readonly clicked = output<void>();
}
