import { Component, Injector, inject, input, output, runInInjectionContext, type OnInit } from "@angular/core";
import { ButtonCnt, InputCnt, Modal, SelectCpt, type SelectOption } from "../../../components/shared";
import { SupplierStatus, type Supplier, type SupplierStatusValue, type UpdateSupplierDto } from "../../../entities";
import { updateSupplier } from "../../../operations/supplier/update-supplier";

@Component({
  selector: "app-update-supplier",
  imports: [Modal, InputCnt, SelectCpt, ButtonCnt],
  template: `
    <app-modal [open]="true" [title]="'Editar ' + supplier().name" (closed)="closed.emit()">
      <form class="form" (submit)="save($event)">
        <app-input name="name" label="Nombre" [(value)]="op.form.name" [required]="true" />
        <div class="row">
          <app-input name="taxId" label="NIT" [(value)]="op.form.taxId" />
          <app-input name="phone" label="Teléfono" [(value)]="op.form.phone" />
        </div>
        <div class="row">
          <app-input name="email" label="Correo" type="email" [(value)]="op.form.email" />
          <app-select name="status" label="Estado" [options]="statusOptions" [(value)]="op.form.status" [required]="true" />
        </div>
        <app-button [name]="op.pending() ? 'Guardando…' : 'Guardar cambios'" [disabled]="op.pending()" />
      </form>
    </app-modal>
  `,
  styles: `.form { display: flex; flex-direction: column; gap: 1.6rem; } .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6rem; } @media (max-width: 768px) { .row { grid-template-columns: 1fr; } }`,
})
export class UpdateSupplier implements OnInit {
  readonly supplier = input.required<Supplier>();
  readonly closed = output<void>();
  readonly statusOptions: SelectOption<SupplierStatusValue>[] = [
    { value: SupplierStatus.ACTIVE, label: "Activo" }, { value: SupplierStatus.INACTIVE, label: "Inactivo" },
  ];
  private readonly injector = inject(Injector);
  op!: ReturnType<typeof updateSupplier>;

  /** El input requerido no existe en el constructor: la operación se construye aquí, con el registro ya enlazado. */
  ngOnInit(): void {
    this.op = runInInjectionContext(this.injector, () => updateSupplier(this.supplier(), (item): UpdateSupplierDto => ({
      name: item.name, taxId: item.taxId ?? "", phone: item.phone ?? "", email: item.email ?? "", status: item.status,
    })));
  }

  async save(event: Event): Promise<void> { if (await this.op.submit(event)) this.closed.emit(); }
}
