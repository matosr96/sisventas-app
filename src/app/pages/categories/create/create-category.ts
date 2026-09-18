import { Component, input, output } from "@angular/core";
import { ButtonCnt, InputCnt, Modal } from "../../../components/shared";
import { createCategory } from "../../../operations/category/create-category";

@Component({
  selector: "app-create-category",
  imports: [Modal, InputCnt, ButtonCnt],
  template: `
    <app-modal [open]="open()" title="Nueva categoría" (closed)="closed.emit()">
      <form class="form" (submit)="save($event)">
        <app-input name="name" label="Nombre" [(value)]="op.form.name" [required]="true" />
        <app-input name="icon" label="Icono (boxicons, opcional)" [(value)]="op.form.icon" placeholder="bx-drink" />
        <app-button [name]="op.pending() ? 'Guardando…' : 'Guardar categoría'" [disabled]="op.pending()" />
      </form>
    </app-modal>
  `,
  styles: `.form { display: flex; flex-direction: column; gap: 1.6rem; }`,
})
export class CreateCategory {
  readonly open = input.required<boolean>();
  readonly closed = output<void>();
  readonly op = createCategory();
  async save(event: Event): Promise<void> { if (await this.op.submit(event)) this.closed.emit(); }
}
