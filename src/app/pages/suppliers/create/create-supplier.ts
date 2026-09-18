import { Component, input, output } from "@angular/core";
import { ButtonCnt, InputCnt, Modal } from "../../../components/shared";
import { createSupplier } from "../../../operations/supplier/create-supplier";

@Component({
  selector: "app-create-supplier",
  imports: [Modal, InputCnt, ButtonCnt],
  template: `
    <app-modal [open]="open()" title="Nuevo proveedor" (closed)="closed.emit()">
      <form class="form" (submit)="save($event)">
        <app-input name="name" label="Nombre" [(value)]="op.form.name" [required]="true" />
        <div class="row">
          <app-input name="taxId" label="NIT" [(value)]="op.form.taxId" />
          <app-input name="phone" label="Teléfono" [(value)]="op.form.phone" />
        </div>
        <app-input name="email" label="Correo" type="email" [(value)]="op.form.email" />
        <app-button [name]="op.pending() ? 'Guardando…' : 'Guardar proveedor'" [disabled]="op.pending()" />
      </form>
    </app-modal>
  `,
  styles: `.form { display: flex; flex-direction: column; gap: 1.6rem; } .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6rem; } @media (max-width: 768px) { .row { grid-template-columns: 1fr; } }`,
})
export class CreateSupplier {
  readonly open = input.required<boolean>();
  readonly closed = output<void>();
  readonly op = createSupplier();
  async save(event: Event): Promise<void> { if (await this.op.submit(event)) this.closed.emit(); }
}
