import { Component, computed, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Empty, Table, type Row } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { HeaderPage, Loader } from "../../components/shared";
import { PrivateRoutes, ScreenName } from "../../constants";
import { productStatusLabel, type Product } from "../../entities";
import { deleteItem } from "../../operations/delete-item";
import { listProducts } from "../../operations/product/list-products";
import { AuthStore } from "../../store/auth";
import { formatMoney } from "../../utils";
import { CreateProduct } from "./create/create-product";
import { UpdateProduct } from "./update/update-product";

@Component({
  selector: "app-products",
  imports: [Layout, HeaderPage, Loader, Table, Empty, CreateProduct, UpdateProduct],
  templateUrl: "./products.html",
  styleUrl: "./products.css",
})
export class Products {
  private readonly router = inject(Router);
  readonly auth = inject(AuthStore);
  readonly screen = ScreenName.PRODUCT;
  readonly list = listProducts((product, term) => [product.sku, product.name].join(" ").toLowerCase().includes(term));
  readonly remover = deleteItem();
  readonly creating = signal(false);
  readonly editing = signal<Product | null>(null);

  /** Los valores derivados (etiquetas, dinero) se calculan aquí, no dentro de la tabla. */
  readonly rows = computed<Row[]>(() =>
    this.list.filtered().map((product) => ({
      ...product,
      priceLabel: formatMoney(product.salePrice),
      statusLabel: productStatusLabel(product.status),
      stockLabel: product.lowStock != null && product.currentStock <= product.lowStock ? `${product.currentStock} (bajo)` : product.currentStock,
    }))
  );

  open(row: Row): void { void this.router.navigate([PrivateRoutes.PRODUCTS, row["id"]]); }
  edit(row: Row): void { this.editing.set(this.list.items().find((product) => product.id === row["id"]) ?? null); }
  remove(row: Row): void { this.remover.remove(this.screen, Number(row["id"])); }
}
