import { Component, input, model } from "@angular/core";

export interface SelectOption<T extends string | number = string | number> { value: T; label: string; }

/** Select genérico: el tipo del valor lo fijan las opciones (número para ids, texto para estados). */
@Component({
  selector: "app-select",
  templateUrl: "./select.html",
  styleUrl: "./select.css",
})
export class SelectCpt<T extends string | number> {
  readonly name = input.required<string>();
  readonly label = input("");
  readonly placeholder = input("Selecciona…");
  readonly options = input.required<SelectOption<T>[]>();
  readonly required = input(false);
  readonly value = model<T | null>(null);

  onChange(event: Event): void {
    const raw = (event.target as HTMLSelectElement).value;
    const option = this.options().find((item) => String(item.value) === raw);
    this.value.set(option ? option.value : null);
  }
}
