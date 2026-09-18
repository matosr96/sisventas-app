import { Component, computed, inject, signal } from "@angular/core";
import { Empty, Table, type Row } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { HeaderPage, Loader } from "../../components/shared";
import { ScreenName } from "../../constants";
import type { Supplier } from "../../entities";
import { deleteItem } from "../../operations/delete-item";
import { listSuppliers } from "../../operations/supplier/list-suppliers";
import { AuthStore } from "../../store/auth";
import { CreateSupplier } from "./create/create-supplier";
import { UpdateSupplier } from "./update/update-supplier";
import { supplierStatusLabel } from "../../entities";

@Component({
  selector: "app-suppliers",
  imports: [Layout, HeaderPage, Loader, Table, Empty, CreateSupplier, UpdateSupplier],
  templateUrl: "./suppliers.html",
  styleUrl: "./suppliers.css",
})
export class Suppliers {
  readonly auth = inject(AuthStore);
  readonly screen = ScreenName.SUPPLIER;
  readonly list = listSuppliers((item, term) => JSON.stringify(item).toLowerCase().includes(term));
  readonly remover = deleteItem();
  readonly creating = signal(false);
  readonly editing = signal<Supplier | null>(null);
  readonly rows = computed<Row[]>(() => this.list.filtered().map((item) => ({ ...item, statusLabel: supplierStatusLabel(item.status) })));

  edit(row: Row): void { this.editing.set(this.list.items().find((item) => item.id === row["id"]) ?? null); }
  remove(row: Row): void { this.remover.remove(this.screen, Number(row["id"])); }
}
