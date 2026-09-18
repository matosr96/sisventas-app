import { Component, input, model } from "@angular/core";

@Component({
  selector: "app-search",
  templateUrl: "./search.html",
  styleUrl: "./search.css",
})
export class Search {
  readonly placeholder = input("Buscar…");
  readonly value = model("");

  onInput(event: Event): void {
    this.value.set((event.target as HTMLInputElement).value);
  }
}
