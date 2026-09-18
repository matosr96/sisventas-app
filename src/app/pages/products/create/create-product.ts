import { Component, computed, input, output } from "@angular/core";
import { ButtonCnt, InputCnt, Modal, NumberInput, SelectCpt, type SelectOption } from "../../../components/shared";
import { listCategories } from "../../../operations/category/list-categories";
import { createProduct } from "../../../operations/product/create-product";

@Component({
  selector: "app-create-product",
  imports: [Modal, InputCnt, NumberInput, SelectCpt, ButtonCnt],
  template: `
    <app-modal [open]="open()" variant="drawer" title="Nuevo producto" subtitle="SKU, precio y stock inicial; la categoría es opcional." (closed)="closed.emit()">
      <form class="form" (submit)="save($event)">
        <div class="row">
          <app-input name="sku" label="SKU" [(value)]="op.form.sku" [required]="true" placeholder="COCA-350" />
          <app-input name="name" label="Nombre" [(value)]="op.form.name" [required]="true" />
        </div>
        <div class="row">
          <app-number-input name="salePrice" label="Precio de venta" [(value)]="op.form.salePrice" [required]="true" [min]="0" />
          <app-number-input name="purchasePrice" label="Costo de referencia" [(value)]="op.form.purchasePrice" [min]="0" />
        </div>
        <div class="row">
          <app-number-input name="initialStock" label="Stock inicial" [(value)]="op.form.initialStock" [required]="true" [min]="0" step="1" />
          <app-number-input name="lowStock" label="Stock mínimo (aviso)" [(value)]="op.form.lowStock" [min]="0" step="1" />
        </div>
        <app-select name="categoryId" label="Categoría" [options]="categoryOptions()" [(value)]="op.form.categoryId" placeholder="Sin categoría" />
        <app-input name="image" label="Imagen (URL, opcional)" [(value)]="op.form.image" placeholder="https://…/producto.jpg" />
        <app-button [name]="op.pending() ? 'Guardando…' : 'Guardar producto'" [disabled]="op.pending()" />
      </form>
    </app-modal>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 1.6rem; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6rem; }
    @media (max-width: 768px) { .row { grid-template-columns: 1fr; } }
  `,
})
export class CreateProduct {
  readonly open = input.required<boolean>();
  readonly closed = output<void>();
  readonly op = createProduct();
  private readonly categories = listCategories({ limit: 100 });
  readonly categoryOptions = computed<SelectOption<number>[]>(() =>
    this.categories.items().map((category) => ({ value: category.id, label: category.name }))
  );

  async save(event: Event): Promise<void> {
    if (await this.op.submit(event)) this.closed.emit();
  }
}
