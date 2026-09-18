import { Component, computed, inject, signal } from "@angular/core";
import { Empty, Table, type Row } from "../../components/container";
import { Layout } from "../../components/layout/layout";
import { HeaderPage, Skeleton } from "../../components/shared";
import { ScreenName } from "../../constants";
import type { Category } from "../../entities";
import { listCategories } from "../../operations/category/list-categories";
import { deleteItem } from "../../operations/delete-item";
import { AuthStore } from "../../store/auth";
import { CreateCategory } from "./create/create-category";
import { UpdateCategory } from "./update/update-category";

@Component({
  selector: "app-categories",
  imports: [Layout, HeaderPage, Skeleton, Table, Empty, CreateCategory, UpdateCategory],
  templateUrl: "./categories.html",
  styleUrl: "./categories.css",
})
export class Categories {
  readonly auth = inject(AuthStore);
  readonly screen = ScreenName.CATEGORY;
  readonly list = listCategories();
  readonly remover = deleteItem();
  readonly creating = signal(false);
  readonly editing = signal<Category | null>(null);
  readonly rows = computed<Row[]>(() => this.list.items().map((item) => ({ ...item, icon: item.icon || "—" })));

  edit(row: Row): void { this.editing.set(this.list.items().find((item) => item.id === row["id"]) ?? null); }
  remove(row: Row): void { void this.remover.remove(this.screen, Number(row["id"])); }
}
