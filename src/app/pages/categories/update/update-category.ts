import { Component, Injector, inject, input, output, runInInjectionContext, type OnInit } from "@angular/core";
import { ButtonCnt, InputCnt, Modal } from "../../../components/shared";
import type { Category, UpdateCategoryDto } from "../../../entities";
import { updateCategory } from "../../../operations/category/update-category";

@Component({
  selector: "app-update-category",
  imports: [Modal, InputCnt, ButtonCnt],
  template: `
    <app-modal [open]="true" [title]="'Editar ' + category().name" (closed)="closed.emit()">
      <form class="form" (submit)="save($event)">
        <app-input name="name" label="Nombre" [(value)]="op.form.name" [required]="true" />
        <app-input name="icon" label="Icono (boxicons, opcional)" [(value)]="op.form.icon" />
        <app-button [name]="op.pending() ? 'Guardando…' : 'Guardar cambios'" [disabled]="op.pending()" />
      </form>
    </app-modal>
  `,
  styles: `.form { display: flex; flex-direction: column; gap: 1.6rem; }`,
})
export class UpdateCategory implements OnInit {
  readonly category = input.required<Category>();
  readonly closed = output<void>();
  private readonly injector = inject(Injector);
  op!: ReturnType<typeof updateCategory>;

  /** El input requerido no existe en el constructor: la operación se construye aquí, con el registro ya enlazado. */
  ngOnInit(): void {
    this.op = runInInjectionContext(this.injector, () => updateCategory(this.category(), (item): UpdateCategoryDto => ({ name: item.name, icon: item.icon ?? "" })));
  }

  async save(event: Event): Promise<void> { if (await this.op.submit(event)) this.closed.emit(); }
}
