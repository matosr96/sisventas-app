import { Component, Injector, computed, inject, input, output, runInInjectionContext, type OnInit } from "@angular/core";
import { ButtonCnt, InputCnt, Modal, NumberInput, SelectCpt, type SelectOption } from "../../../components/shared";
import { ProductStatus, type Product, type ProductStatusValue, type UpdateProductDto } from "../../../entities";
import { listCategories } from "../../../operations/category/list-categories";
import { updateProduct } from "../../../operations/product/update-product";

/** Se crea por registro (la pantalla lo monta dentro de un @if con el producto): nunca se sincroniza. */
@Component({
  selector: "app-update-product",
  imports: [Modal, InputCnt, NumberInput, SelectCpt, ButtonCnt],
  template: `
    <app-modal [open]="true" [title]="'Editar ' + product().name" (closed)="closed.emit()">
      <form class="form" (submit)="save($event)">
        <div class="row">
          <app-input name="sku" label="SKU" [(value)]="op.form.sku" [required]="true" />
          <app-input name="name" label="Nombre" [(value)]="op.form.name" [required]="true" />
        </div>
        <div class="row">
          <app-number-input name="salePrice" label="Precio de venta" [(value)]="op.form.salePrice" [min]="0" />
          <app-number-input name="lowStock" label="Stock mínimo (aviso)" [(value)]="op.form.lowStock" [min]="0" step="1" />
        </div>
        <div class="row">
          <app-select name="categoryId" label="Categoría" [options]="categoryOptions()" [(value)]="op.form.categoryId" placeholder="Sin categoría" />
          <app-select name="status" label="Estado" [options]="statusOptions" [(value)]="op.form.status" [required]="true" />
        </div>
        <p class="hint">El stock no se edita aquí: se mueve con compras, ventas, anulaciones o un ajuste desde la ficha.</p>
        <app-button [name]="op.pending() ? 'Guardando…' : 'Guardar cambios'" [disabled]="op.pending()" />
      </form>
    </app-modal>
  `,
  styles: `
    .form { display: flex; flex-direction: column; gap: 1.6rem; }
    .row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.6rem; }
    .hint { font-size: 1.3rem; color: var(--text-muted); }
    @media (max-width: 768px) { .row { grid-template-columns: 1fr; } }
  `,
})
export class UpdateProduct implements OnInit {
  readonly product = input.required<Product>();
  readonly closed = output<void>();
  private readonly categories = listCategories(() => true);
  readonly categoryOptions = computed<SelectOption<number>[]>(() =>
    this.categories.items().map((category) => ({ value: category.id, label: category.name }))
  );
  readonly statusOptions: SelectOption<ProductStatusValue>[] = [
    { value: ProductStatus.ACTIVE, label: "Activo" }, { value: ProductStatus.INACTIVE, label: "Retirado" },
  ];

  private readonly injector = inject(Injector);
  op!: ReturnType<typeof updateProduct>;

  /** El input requerido no existe en el constructor: la operación se construye aquí, con el registro ya enlazado. */
  ngOnInit(): void {
    this.op = runInInjectionContext(this.injector, () => updateProduct(this.product(), (item): UpdateProductDto => ({
      sku: item.sku, name: item.name, salePrice: item.salePrice, purchasePrice: item.purchasePrice,
      lowStock: item.lowStock, categoryId: item.categoryId, status: item.status, image: item.image ?? "",
    })));
  }

  async save(event: Event): Promise<void> {
    if (await this.op.submit(event)) this.closed.emit();
  }
}
