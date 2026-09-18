import { Component, input, model } from "@angular/core";

/** Campo de texto. `value` es de doble vía: [(value)]="form.name". Para números, app-number-input. */
@Component({
  selector: "app-input",
  templateUrl: "./input.html",
  styleUrl: "./input.css",
})
export class InputCnt {
  readonly name = input.required<string>();
  readonly label = input("");
  readonly type = input<"text" | "password" | "email" | "date">("text");
  readonly placeholder = input("");
  readonly required = input(false);
  readonly value = model<string>("");

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
