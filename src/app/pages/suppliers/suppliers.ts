import { Component, computed, inject, signal } from "@angular/core";
import { Empty, Table, badge, type Row } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { FilterChips, HeaderPage, Skeleton, type FilterOption } from "../../components/shared";
import { ScreenName } from "../../constants";
import { SupplierStatus, supplierStatusLabel, type Supplier } from "../../entities";
import { deleteItem } from "../../operations/delete-item";
import { listSuppliers } from "../../operations/supplier/list-suppliers";
import { AuthStore } from "../../store/auth";
import { CreateSupplier } from "./create/create-supplier";
import { UpdateSupplier } from "./update/update-supplier";

@Component({
  selector: "app-suppliers",
  imports: [Layout, HeaderPage, Skeleton, Table, Empty, FilterChips, CreateSupplier, UpdateSupplier],
  templateUrl: "./suppliers.html",
  styleUrl: "./suppliers.css",
})
export class Suppliers {
  readonly auth = inject(AuthStore);
  readonly screen = ScreenName.SUPPLIER;
  readonly list = listSuppliers((item, term) => [item.name, item.taxId, item.email, item.phone].join(" ").toLowerCase().includes(term));
  readonly remover = deleteItem();
  readonly creating = signal(false);
  readonly editing = signal<Supplier | null>(null);
  readonly statusOptions: FilterOption[] = [
    { value: SupplierStatus.ACTIVE, label: "Activos" }, { value: SupplierStatus.INACTIVE, label: "Inactivos" },
  ];
  readonly statusFilter = computed(() => this.list.filters()["status"] ?? null);
  readonly rows = computed<Row[]>(() =>
    this.list.filtered().map((item) => ({
      ...item, statusCell: badge(supplierStatusLabel(item.status), item.status === SupplierStatus.ACTIVE ? "ok" : "neutral"),
    }))
  );

  edit(row: Row): void { this.editing.set(this.list.items().find((item) => item.id === row["id"]) ?? null); }
  remove(row: Row): void { this.remover.remove(this.screen, Number(row["id"])); }
}
