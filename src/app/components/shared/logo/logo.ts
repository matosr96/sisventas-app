import { Component, input } from "@angular/core";

/**
 * La marca se pinta con SVG en el DOM: el aro en el azul del tema y el texto en currentColor,
 * así no desaparece en oscuro. `lockup` (marca + subtítulo), `logotipo` (solo marca), `mark` (solo el aro).
 */
@Component({
  selector: "app-logo",
  templateUrl: "./logo.html",
  styleUrl: "./logo.css",
})
export class Logo {
  readonly variant = input<"lockup" | "logotipo" | "mark">("logotipo");
  readonly size = input<"sm" | "md" | "lg">("md");
}
