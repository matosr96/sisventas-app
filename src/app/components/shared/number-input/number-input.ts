import { Component, input, model } from "@angular/core";

/** Campo numérico: el modelo es number | null, nunca "" ni NaN. Se pinta con value ?? "". */
@Component({
  selector: "app-number-input",
  template: `
    <label class="field">
      @if (label()) { <span class="label">{{ label() }}</span> }
      <input class="input" type="number" [name]="name()" [placeholder]="placeholder()" [required]="required()"
        [attr.min]="min()" [attr.step]="step()" [value]="value() ?? ''" (input)="onInput($event)" />
    </label>
  `,
  styles: `
    .field { display: flex; flex-direction: column; gap: 0.6rem; width: 100%; }
    .label { font-size: 1.3rem; font-weight: 500; color: var(--text-muted); }
    .input { width: 100%; padding: 1rem 1.2rem; border-radius: var(--radius); border: 1px solid var(--border-color); background-color: var(--field-bg); color: var(--text-color); transition: border-color .2s ease, box-shadow .2s ease; }
    .input:focus { outline: none; border-color: var(--blue-bg); box-shadow: 0 0 0 3px var(--blue-soft); }
  `,
})
export class NumberInput {
  readonly name = input.required<string>();
  readonly label = input("");
  readonly placeholder = input("");
  readonly required = input(false);
  readonly min = input<number | null>(null);
  readonly step = input("any");
  readonly value = model<number | null>(null);

  onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    this.value.set(raw === "" ? null : Number(raw));
  }
}
