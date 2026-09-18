import { Component, computed, inject, signal } from "@angular/core";
import { Router } from "@angular/router";
import { Empty, Table, badge, type Row } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { FilterChips, HeaderPage, Skeleton, type FilterOption } from "../../components/shared";
import { PrivateRoutes, ScreenName } from "../../constants";
import { ProductStatus, productStatusLabel, type Product } from "../../entities";
import { listCategories } from "../../operations/category/list-categories";
import { deleteItem } from "../../operations/delete-item";
import { listProducts } from "../../operations/product/list-products";
import { AuthStore } from "../../store/auth";
import { formatMoney } from "../../utils";
import { CreateProduct } from "./create/create-product";
import { UpdateProduct } from "./update/update-product";

@Component({
  selector: "app-products",
  imports: [Layout, HeaderPage, Skeleton, Table, Empty, FilterChips, CreateProduct, UpdateProduct],
  templateUrl: "./products.html",
  styleUrl: "./products.css",
})
export class Products {
  private readonly router = inject(Router);
  readonly auth = inject(AuthStore);
  readonly screen = ScreenName.PRODUCT;
  readonly list = listProducts((product, term) => [product.sku, product.name].join(" ").toLowerCase().includes(term));
  private readonly categories = listCategories(() => true);
  readonly remover = deleteItem();
  readonly creating = signal(false);
  readonly editing = signal<Product | null>(null);

  readonly statusOptions: FilterOption[] = [
    { value: ProductStatus.ACTIVE, label: "Activos" }, { value: ProductStatus.INACTIVE, label: "Retirados" },
  ];
  readonly categoryOptions = computed<FilterOption[]>(() =>
    this.categories.items().map((category) => ({ value: String(category.id), label: category.name }))
  );
  readonly statusFilter = computed(() => this.list.filters()["status"] ?? null);
  readonly categoryFilter = computed(() => this.list.filters()["categoryId"] ?? null);

  /** Los valores derivados (etiquetas, dinero, badges) se calculan aquí, no dentro de la tabla. */
  readonly rows = computed<Row[]>(() =>
    this.list.filtered().map((product) => ({
      ...product,
      priceLabel: formatMoney(product.salePrice),
      statusCell: badge(productStatusLabel(product.status), product.status === ProductStatus.ACTIVE ? "ok" : "neutral"),
      stockCell: product.currentStock <= 0
        ? badge("Agotado", "danger")
        : product.lowStock != null && product.currentStock <= product.lowStock
          ? badge(`${product.currentStock} · bajo`, "warn")
          : product.currentStock,
    }))
  );

  open(row: Row): void { void this.router.navigate([PrivateRoutes.PRODUCTS, row["id"]]); }
  edit(row: Row): void { this.editing.set(this.list.items().find((product) => product.id === row["id"]) ?? null); }
  remove(row: Row): void { this.remover.remove(this.screen, Number(row["id"])); }
}
