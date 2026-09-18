import { Component, computed, input, output } from "@angular/core";
import type { Product } from "../../../entities";
import { formatMoney } from "../../../utils";
import { Badge } from "../../shared/badge/badge";

/**
 * Baldosa de producto de la pantalla de venta/compra: nombre, SKU, precio y stock. Un clic la
 * añade al pedido. `price` decide qué cifra se muestra (precio de venta o último costo).
 */
@Component({
  selector: "app-product-tile",
  imports: [Badge],
  template: `
    <button type="button" class="tile" [class.picked]="quantity() > 0" [disabled]="disabled()" (click)="pick.emit(product())"
      [attr.aria-label]="product().name + ', ' + priceLabel()">
      <span class="top">
        <span class="sku">{{ product().sku }}</span>
        @if (quantity() > 0) { <span class="count">{{ quantity() }}</span> }
      </span>
      @if (product().image) { <img class="image" [src]="product().image" alt="" loading="lazy" /> }
      <span class="name">{{ product().name }}</span>
      <span class="bottom">
        <span class="price">{{ priceLabel() }}</span>
        <app-badge [label]="stockLabel()" [tone]="stockTone()" />
      </span>
    </button>
  `,
  styles: `
    .tile { display: flex; flex-direction: column; gap: 0.6rem; width: 100%; min-height: 11rem; padding: 1.2rem 1.4rem; text-align: left; background-color: var(--main-color); border: 1px solid var(--border-color); border-radius: var(--radius); box-shadow: var(--box-shadow); transition: border-color .15s ease, transform .1s ease, background-color .15s ease; }
    .tile:hover:not(:disabled) { border-color: var(--blue-bg); transform: translateY(-1px); }
    .tile:active:not(:disabled) { transform: translateY(0); }
    .tile:disabled { opacity: 0.5; cursor: not-allowed; }
    .picked { border-color: var(--blue-bg); background-color: var(--blue-soft); }
    .top { display: flex; align-items: center; justify-content: space-between; gap: 0.8rem; }
    .sku { font-size: 1.2rem; font-weight: 600; color: var(--text-muted); letter-spacing: 0.02em; }
    .count { min-width: 2.2rem; padding: 0.1rem 0.6rem; border-radius: 99rem; background-color: var(--blue-bg); color: var(--on-accent); font-size: 1.2rem; font-weight: 700; text-align: center; }
    .name { flex: 1; font-weight: 600; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
    .bottom { display: flex; align-items: center; justify-content: space-between; gap: 0.8rem; }
    .price { font-weight: 700; font-size: 1.5rem; }
    .image { width: 100%; height: 7rem; object-fit: cover; border-radius: var(--radius-sm); background-color: var(--white-two); }
  `,
})
export class ProductTile {
  readonly product = input.required<Product>();
  readonly quantity = input(0);
  readonly price = input<"sale" | "cost">("sale");
  readonly disabled = input(false);
  readonly pick = output<Product>();

  readonly priceLabel = computed(() => {
    const value = this.price() === "cost" ? this.product().purchasePrice : this.product().salePrice;
    return value == null ? "Sin precio" : formatMoney(value);
  });
  readonly stockLabel = computed(() => `${this.product().currentStock} en stock`);
  readonly stockTone = computed(() => {
    const product = this.product();
    if (product.currentStock <= 0) return "danger" as const;
    if (product.lowStock != null && product.currentStock <= product.lowStock) return "warn" as const;
    return "ok" as const;
  });
}
